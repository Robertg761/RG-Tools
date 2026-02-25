import type { MetadataRoute } from "next";
import { PROJECTS } from "@/lib/projects";

export const dynamic = "force-static";

const BASE_URL = "https://rgprojectdump.ca";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const projectPages = PROJECTS.map((project) => ({
    url: `${BASE_URL}/project/${project.repoName}`,
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
