const GITHUB_OWNER = process.env.GITHUB_OWNER?.trim() || "Robertg761";
const GITHUB_API_BASE = "https://api.github.com";
const EXCLUDED_REPOSITORY_KEYS = new Set(["rgtools"]);
const STAR_WEIGHT = 0.55;
const RECENCY_WEIGHT = 0.45;

interface GitHubRepo {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  topics?: string[];
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  updated_at: string;
  pushed_at: string;
  homepage: string | null;
  default_branch: string;
  private: boolean;
}

interface GitHubReadme {
  content?: string;
  encoding?: string;
}

export interface Project {
  id: number;
  title: string;
  repoName: string;
  description: string;
  version: string;
  tags: string[];
  link: string;
  bugLink: string;
}

interface ProjectDetail {
  repoData: GitHubRepo;
  readme: string;
  branch: string;
}

function normalizeRepositoryKey(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function isExcludedRepository(name: string) {
  return EXCLUDED_REPOSITORY_KEYS.has(normalizeRepositoryKey(name));
}

function buildGitHubHeaders() {
  const token = process.env.GITHUB_TOKEN?.trim();
  return {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function fetchGitHubJson<T>(url: string): Promise<T | null> {
  const response = await fetch(url, {
    headers: buildGitHubHeaders(),
  });

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as T;
}

function normalizeTag(value: string) {
  return value
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatVersionDate(dateString: string) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return "Public Repository";
  }

  return `Updated ${new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date)}`;
}

function toTimestamp(value: string) {
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function getRepoActivityTimestamp(repo: GitHubRepo) {
  return Math.max(toTimestamp(repo.pushed_at), toTimestamp(repo.updated_at));
}

function rankReposForListing(repos: GitHubRepo[]) {
  if (repos.length <= 1) {
    return repos;
  }

  const maxStars = Math.max(1, ...repos.map((repo) => Math.max(repo.stargazers_count, 0)));
  const activities = repos.map((repo) => getRepoActivityTimestamp(repo));
  const minActivity = Math.min(...activities);
  const maxActivity = Math.max(...activities);
  const activityRange = Math.max(1, maxActivity - minActivity);

  const scored = repos.map((repo) => {
    const stars = Math.max(repo.stargazers_count, 0);
    const starsScore = Math.log1p(stars) / Math.log1p(maxStars);
    const recencyScore = (getRepoActivityTimestamp(repo) - minActivity) / activityRange;
    const combinedScore = starsScore * STAR_WEIGHT + recencyScore * RECENCY_WEIGHT;

    return {
      repo,
      combinedScore,
      stars,
      activity: getRepoActivityTimestamp(repo),
    };
  });

  scored.sort((a, b) => {
    const scoreDiff = b.combinedScore - a.combinedScore;
    if (Math.abs(scoreDiff) > 1e-9) {
      return scoreDiff;
    }

    if (b.stars !== a.stars) {
      return b.stars - a.stars;
    }

    if (b.activity !== a.activity) {
      return b.activity - a.activity;
    }

    return a.repo.name.localeCompare(b.repo.name);
  });

  return scored.map((entry) => entry.repo);
}

function toProject(repo: GitHubRepo): Project {
  const topicTags = (repo.topics ?? []).slice(0, 3).map(normalizeTag);
  const languageTag = repo.language ? [repo.language] : [];
  const tags = [...new Set([...languageTag, ...topicTags])];

  return {
    id: repo.id,
    title: repo.name,
    repoName: repo.name,
    description: repo.description?.trim() || "No description provided yet.",
    version: formatVersionDate(repo.pushed_at || repo.updated_at),
    tags: tags.length > 0 ? tags : ["Public Repo"],
    link: repo.html_url,
    bugLink: `${repo.html_url}/issues`,
  };
}

async function fetchAllPublicRepos(): Promise<GitHubRepo[]> {
  const repos: GitHubRepo[] = [];

  for (let page = 1; page <= 10; page += 1) {
    const pageRepos = await fetchGitHubJson<GitHubRepo[]>(
      `${GITHUB_API_BASE}/users/${encodeURIComponent(
        GITHUB_OWNER
      )}/repos?type=public&sort=updated&direction=desc&per_page=100&page=${page}`
    );

    if (!pageRepos || pageRepos.length === 0) {
      break;
    }

    repos.push(
      ...pageRepos.filter((repo) => !repo.private && !isExcludedRepository(repo.name))
    );

    if (pageRepos.length < 100) {
      break;
    }
  }

  return rankReposForListing(repos);
}

export async function getAllPublicProjects(): Promise<Project[]> {
  const repos = await fetchAllPublicRepos();
  return repos.map(toProject);
}

export function toProjectSlug(repoName: string) {
  return encodeURIComponent(repoName);
}

export function fromProjectSlug(slug: string) {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}

async function fetchRepoReadme(repoName: string): Promise<string> {
  const readme = await fetchGitHubJson<GitHubReadme>(
    `${GITHUB_API_BASE}/repos/${encodeURIComponent(
      GITHUB_OWNER
    )}/${encodeURIComponent(repoName)}/readme`
  );

  if (!readme?.content || readme.encoding !== "base64") {
    return "";
  }

  return Buffer.from(readme.content.replace(/\n/g, ""), "base64").toString("utf-8");
}

export async function getProjectDetail(repoNameOrSlug: string): Promise<ProjectDetail | null> {
  const repoName = fromProjectSlug(repoNameOrSlug);
  const repoData = await fetchGitHubJson<GitHubRepo>(
    `${GITHUB_API_BASE}/repos/${encodeURIComponent(
      GITHUB_OWNER
    )}/${encodeURIComponent(repoName)}`
  );

  if (!repoData || repoData.private || isExcludedRepository(repoData.name)) {
    return null;
  }

  const readme = await fetchRepoReadme(repoData.name);
  const branch = repoData.default_branch || "main";

  return { repoData, readme, branch };
}

function resolveRelativeImageUrl(url: string, repoName: string, branch: string) {
  if (url.startsWith("http") || url.startsWith("data:")) {
    return url;
  }

  if (url.startsWith("//")) {
    return `https:${url}`;
  }

  const withoutPrefix = url.replace(/^\.?\//, "");
  const [pathPart, query = ""] = withoutPrefix.split("?");
  const encodedPath = pathPart
    .split("/")
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))
    .join("/");

  const rawBase = `https://raw.githubusercontent.com/${encodeURIComponent(
    GITHUB_OWNER
  )}/${encodeURIComponent(repoName)}/${encodeURIComponent(branch)}`;

  return `${rawBase}/${encodedPath}${query ? `?${query}` : ""}`;
}

export function extractProjectImages(markdown: string, repoName: string, branch: string) {
  const images: string[] = [];
  const markdownImageRegex = /!\[.*?\]\(([^)]+)\)/g;
  const htmlImageRegex = /<img[^>]+src=["']([^"']+)["']/gi;

  let match: RegExpExecArray | null;
  while ((match = markdownImageRegex.exec(markdown)) !== null) {
    images.push(match[1].trim());
  }

  while ((match = htmlImageRegex.exec(markdown)) !== null) {
    images.push(match[1].trim());
  }

  const ignoredPatterns = [
    /shields\.io/i,
    /badge/i,
    /travis-ci/i,
    /circleci/i,
    /sonarcloud/i,
    /codecov/i,
    /coveralls/i,
    /appveyor/i,
    /opencollective/i,
    /ko-fi/i,
    /buymeacoffee/i,
    /sponsor/i,
    /license/i,
    /actions\/workflows/i,
    /github\.com\/.*\/badges\//i,
    /github\.com\/.*\/actions\//i,
    /\.svg/i,
  ];

  return Array.from(new Set(images))
    .filter((url) => !ignoredPatterns.some((pattern) => pattern.test(url)))
    .map((url) => resolveRelativeImageUrl(url, repoName, branch));
}

export function stripProjectImages(markdown: string) {
  const markdownImageRegex = /!\[.*?\]\(([^)]+)\)/g;
  const htmlImageRegex = /<img[^>]*>/gi;
  return markdown.replace(markdownImageRegex, "").replace(htmlImageRegex, "");
}
