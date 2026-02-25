"use client";

import { motion } from "framer-motion";
import { ExternalLink, Bug, TerminalSquare } from "lucide-react";
import Link from "next/link";
import type { Project } from "@/lib/projects";

interface ProjectsProps {
  projects: Project[];
}

export function Projects({ projects }: ProjectsProps) {
  return (
    <section id="projects" className="py-24 px-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="mb-16 text-center"
      >
        <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">Latest Projects</h2>
        <p className="text-white/60 max-w-2xl mx-auto">
          Every public repository is synced directly from GitHub and formatted for a consistent browsing experience.
        </p>
      </motion.div>

      {projects.length === 0 && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center">
          <p className="text-white/70">
            No public repositories are available right now. Please check again shortly.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects.map((project, idx) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="group relative p-8 rounded-2xl bg-white/5 border border-white/10 overflow-hidden hover:border-accent/50 transition-colors"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <TerminalSquare className="text-accent" size={24} />
                  <h3 className="text-2xl font-bold">{project.title}</h3>
                </div>
                <span className="text-xs font-mono px-2 py-1 rounded-full bg-white/10 text-white/70">
                  {project.version}
                </span>
              </div>
              
              <p className="text-white/70 mb-6 flex-grow leading-relaxed">
                {project.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-8">
                {project.tags.map(tag => (
                  <span key={tag} className="text-xs font-medium px-3 py-1 rounded-full bg-accent/20 text-accent">
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center gap-4 pt-4 border-t border-white/10 mt-auto">
                <Link
                  href={`/project/${encodeURIComponent(project.repoName)}`}
                  className="flex items-center gap-2 text-sm font-medium hover:text-accent transition-colors"
                >
                  <ExternalLink size={16} />
                  View Project
                </Link>
                <a
                  href={project.bugLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm font-medium text-white/50 hover:text-red-400 transition-colors ml-auto"
                >
                  <Bug size={16} />
                  Report Bug
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
