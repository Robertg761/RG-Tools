import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Github, Star, GitFork, AlertCircle, Calendar } from 'lucide-react';
import { TableOfContents } from '@/components/TableOfContents';
import { ProjectMediaGallery } from '@/components/ProjectMediaGallery';
import { PROJECTS } from '@/lib/projects';

async function getRepoData(repoName: string) {
  const repoRes = await fetch(`https://api.github.com/repos/Robertg761/${repoName}`, { next: { revalidate: 3600 } });
  if (!repoRes.ok) return null;
  const repoData = await repoRes.json();
  
  const branch = repoData.default_branch || 'main';
  let readmeRes = await fetch(`https://raw.githubusercontent.com/Robertg761/${repoName}/${branch}/README.md`, { next: { revalidate: 3600 } });
  
  if (!readmeRes.ok && branch === 'main') {
    readmeRes = await fetch(`https://raw.githubusercontent.com/Robertg761/${repoName}/master/README.md`, { next: { revalidate: 3600 } });
  }

  const readme = readmeRes.ok ? await readmeRes.text() : '';

  return { repoData, readme, branch: branch === 'main' && !readmeRes.ok ? 'master' : branch };
}

function extractImages(markdown: string, repoName: string, branch: string) {
  const images: string[] = [];
  const mdRegex = /!\[.*?\]\(([^\)]+)\)/g;
  const htmlRegex = /<img[^>]+src=["']([^"']+)["']/gi;
  
  let match;
  while ((match = mdRegex.exec(markdown)) !== null) {
    images.push(match[1].trim());
  }
  while ((match = htmlRegex.exec(markdown)) !== null) {
    images.push(match[1].trim());
  }

  // Common badge, CI, license, and sponsor domains/patterns to ignore
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
    /\.svg/i // Most badges are SVGs, and regular screenshots are PNG/JPG
  ];

  // Deduplicate and resolve relative URLs
  return Array.from(new Set(images))
    .filter(url => !ignoredPatterns.some(pattern => pattern.test(url)))
    .map(url => {
      if (url.startsWith('http') || url.startsWith('data:')) return url;
      return `https://raw.githubusercontent.com/Robertg761/${repoName}/${branch}/${url.replace(/^\.\//, '')}`;
    });
}

function stripImages(markdown: string) {
  const mdRegex = /!\[.*?\]\(([^\)]+)\)/g;
  const htmlRegex = /<img[^>]*>/gi;
  // We also want to strip out typical status badges if possible, but taking out images removes most of them.
  return markdown.replace(mdRegex, '').replace(htmlRegex, '');
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  return PROJECTS.map((project) => ({ slug: project.repoName }));
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await getRepoData(slug);

  if (!data) {
    notFound();
  }

  const { repoData, readme, branch } = data;
  const images = extractImages(readme, slug, branch);
  const cleanReadme = stripImages(readme);

  return (
    <div className="min-h-screen pb-24">
      {/* Hero Section */}
      <div className="relative pt-32 pb-20 px-6 border-b border-white/10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-background to-background z-0" />
        <div className="max-w-7xl mx-auto relative z-10">
          <Link href="/#projects" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-12 font-medium">
            <ArrowLeft size={20} />
            Back to Portfolio
          </Link>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6 text-white drop-shadow-sm">{repoData.name}</h1>
          <p className="text-xl md:text-2xl text-white/70 max-w-3xl leading-relaxed mb-10 font-light">
            {repoData.description || 'No description provided for this repository.'}
          </p>
          
          <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-white/70 mb-12">
            {repoData.language && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-accent shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                {repoData.language}
              </div>
            )}
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
              <Star size={16} className="text-yellow-400" />
              {repoData.stargazers_count} Stars
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
              <GitFork size={16} className="text-blue-400" />
              {repoData.forks_count} Forks
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
              <AlertCircle size={16} className="text-red-400" />
              {repoData.open_issues_count} Issues
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
              <Calendar size={16} className="text-white/50" />
              Updated {new Date(repoData.updated_at).toLocaleDateString()}
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <a 
              href={repoData.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black rounded-full transition-all hover:scale-105 active:scale-95 font-bold shadow-xl"
            >
              <Github size={20} />
              View on GitHub
            </a>
            {repoData.homepage && (
              <a 
                href={repoData.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-white rounded-full transition-all hover:scale-105 active:scale-95 font-bold shadow-[0_0_20px_rgba(59,130,246,0.4)]"
              >
                Visit Live Site
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-[90rem] mx-auto px-6 py-20 flex flex-col lg:flex-row gap-12 xl:gap-16">
        {/* Table of Contents - Left Column */}
        <div className="hidden lg:block lg:w-48 xl:w-64 shrink-0">
          <TableOfContents markdown={cleanReadme} />
        </div>

        {/* Main Content / Text Blurbs */}
        <div className="flex-1 min-w-0">
          <div className="mb-12">
            <h2 id="about-the-project" className="text-3xl font-bold mb-6 flex items-center gap-4 text-white">
              <span className="w-10 h-1.5 bg-accent rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
              About the Project
            </h2>
          </div>
          
          <article className="text-lg leading-relaxed text-white/80 font-light">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]} 
              rehypePlugins={[rehypeRaw, rehypeSlug]}
              components={{
                h1: () => null, // Hide H1 since we use the repo name in the hero
                h2: ({ ...props }) => <h3 className="text-3xl font-bold text-white mt-16 mb-6 tracking-tight" {...props} />,
                h3: ({ ...props }) => <h4 className="text-2xl font-bold text-white mt-12 mb-4 tracking-tight" {...props} />,
                h4: ({ ...props }) => <h5 className="text-xl font-bold text-white/90 mt-8 mb-4 tracking-tight" {...props} />,
                p: ({ ...props }) => <p className="mb-8 text-xl text-white/70" {...props} />,
                ul: ({ ...props }) => <ul className="space-y-4 mb-10" {...props} />,
                ol: ({ ...props }) => <ol className="list-decimal pl-6 space-y-4 mb-10 text-xl text-white/70" {...props} />,
                li: ({ ...props }) => (
                  // Only add custom bullets to unordered lists, let ordered lists use default decimal
                  <li className="text-xl text-white/70">
                    {props.children}
                  </li>
                ),
                a: ({ ...props }) => <a className="text-accent hover:text-accent/80 transition-colors underline underline-offset-4 decoration-accent/30 hover:decoration-accent" target="_blank" rel="noopener noreferrer" {...props} />,
                blockquote: ({ ...props }) => (
                  <blockquote className="pl-6 border-l-4 border-accent/50 italic text-white/60 my-10 py-4 bg-gradient-to-r from-accent/5 to-transparent rounded-r-2xl" {...props} />
                ),
                code(props) {
                  const {children, className, ...rest} = props;
                  const match = /language-(\w+)/.exec(className || '');
                  // Consider it an inline code block if it doesn't have a specific language class
                  const isInline = !match && !className?.includes('language-');
                  
                  return isInline ? (
                    <code className="bg-white/10 text-accent px-2 py-1 rounded-md font-mono text-[0.9em]" {...rest}>{children}</code>
                  ) : (
                    <div className="my-10 rounded-2xl overflow-hidden bg-[#0a0a0a] border border-white/10 shadow-2xl relative group">
                      <div className="absolute top-0 left-0 right-0 h-8 bg-white/5 border-b border-white/10 flex items-center px-4 gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/50" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                        <div className="w-3 h-3 rounded-full bg-green-500/50" />
                      </div>
                      <div className="p-6 pt-12 overflow-x-auto">
                        <code className={`block text-white/80 font-mono text-sm leading-loose ${className || ''}`} {...rest}>
                          {children}
                        </code>
                      </div>
                    </div>
                  );
                },
                table: ({ ...props }) => (
                  <div className="overflow-x-auto my-10 rounded-2xl border border-white/10">
                    <table className="w-full text-left border-collapse" {...props} />
                  </div>
                ),
                th: ({ ...props }) => <th className="bg-white/5 px-6 py-4 font-bold text-white border-b border-white/10" {...props} />,
                td: ({ ...props }) => <td className="px-6 py-4 border-b border-white/5 text-white/70" {...props} />,
              }}
            >
              {cleanReadme}
            </ReactMarkdown>
          </article>
        </div>

        {/* Media Gallery Column */}
        <div className="lg:w-64 xl:w-80 shrink-0">
          <div className="sticky top-32 space-y-8">
            <h3 className="text-sm font-bold text-white/40 uppercase tracking-[0.2em] mb-8 flex items-center gap-4">
              Project Media
              <div className="h-px bg-white/10 flex-grow" />
            </h3>
            
            <ProjectMediaGallery images={images} />
          </div>
        </div>
      </div>
    </div>
  );
}
