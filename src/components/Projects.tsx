"use client";

import { motion } from "framer-motion";
import { ExternalLink, Bug, TerminalSquare } from "lucide-react";
import Link from "next/link";

const PROJECTS = [
  {
    id: 1,
    title: "HA-Desktop-Widget",
    repoName: "HA-Desktop-Widget",
    description: "A convenient tool for Home Assistant that provides quick access to your smart home devices from your desktop.",
    version: "Latest",
    tags: ["JavaScript", "Home Assistant"],
    link: "https://github.com/Robertg761/HA-Desktop-Widget",
    bugLink: "https://github.com/Robertg761/HA-Desktop-Widget/issues"
  },
  {
    id: 2,
    title: "PlayTorrio - Android",
    repoName: "PlayTorrio---Android",
    description: "Open source complete all in one media center with Torrent fetcher and streamer for Android",
    version: "Latest",
    tags: ["HTML", "Android"],
    link: "https://playtorrio.pages.dev/",
    bugLink: "https://github.com/Robertg761/PlayTorrio---Android/issues"
  },
  {
    id: 3,
    title: "Win-Codex",
    repoName: "Win-Codex",
    description: "Run Codex desktop app on Windows by converting the official macOS DMG into a portable Windows build",
    version: "Latest",
    tags: ["PowerShell", "Windows"],
    link: "https://github.com/Robertg761/Win-Codex",
    bugLink: "https://github.com/Robertg761/Win-Codex/issues"
  },
  {
    id: 4,
    title: "stremio-core",
    repoName: "stremio-core",
    description: "⚛️ The Stremio Core: types, addon system, UI models, core logic",
    version: "Latest",
    tags: ["Core Logic", "Stremio"],
    link: "https://github.com/Robertg761/stremio-core",
    bugLink: "https://github.com/Robertg761/stremio-core/issues"
  },
  {
    id: 5,
    title: "LunarLog",
    repoName: "LunarLog",
    description: "An open source project built with Kotlin.",
    version: "Latest",
    tags: ["Kotlin"],
    link: "https://github.com/Robertg761/LunarLog",
    bugLink: "https://github.com/Robertg761/LunarLog/issues"
  }
];

export function Projects() {
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
          Here you&apos;ll find information about my current software releases, upcoming features, and a place to report any issues you encounter.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {PROJECTS.map((project, idx) => (
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
                  href={`/project/${project.repoName}`}
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