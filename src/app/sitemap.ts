import type { MetadataRoute } from "next";
import { getAllPublicProjects, toProjectSlug } from "@/lib/projects";

const BASE_URL = "https://rgprojectdump.ca";
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const projects = await getAllPublicProjects();
  const projectPages = projects.map((project) => ({
    url: `${BASE_URL}/project/${toProjectSlug(project.repoName)}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...projectPages,
  ];
}
