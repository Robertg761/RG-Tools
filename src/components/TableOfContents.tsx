"use client";

import { useEffect, useState, useMemo } from "react";
import { List } from "lucide-react";
import GithubSlugger from "github-slugger";

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents({ markdown }: { markdown: string }) {
  const [activeId, setActiveId] = useState<string>("");

  const headings = useMemo(() => {
    const slugger = new GithubSlugger();
    // Match Markdown headings (## or ###)
    const headingRegex = /^(#{2,3})\s+(.+)$/gm;
    const items: TOCItem[] = [];
    let match;

    // First heading is "About the Project" which we added manually
    items.push({ id: "about-the-project", text: "About the Project", level: 2 });

    while ((match = headingRegex.exec(markdown)) !== null) {
      const level = match[1].length;
      let text = match[2].trim();
      
      // Clean up markdown syntax from text for the TOC display
      text = text.replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1"); // remove links
      text = text.replace(/[*`_]/g, ""); // remove bold/italic/code marks
      
      const id = slugger.slug(text);
      items.push({ id, text, level });
    }

    return items;
  }, [markdown]);

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the topmost intersecting heading
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-100px 0px -80% 0px" } // Adjust margins to trigger when near top
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length <= 1) return null; // Don't show if it's only "About the Project"

  return (
    <div className="sticky top-32 space-y-8">
      <h3 className="text-sm font-bold text-white/40 uppercase tracking-[0.2em] mb-8 flex items-center gap-4">
        <List size={16} />
        Contents
        <div className="h-px bg-white/10 flex-grow" />
      </h3>
      
      <nav className="flex flex-col gap-4 border-l-2 border-white/5 pl-4 relative">
        {headings.map((heading) => (
          <a
            key={heading.id}
            href={`#${heading.id}`}
            className={`text-sm transition-all duration-300 block ${
              activeId === heading.id
                ? "text-accent font-bold translate-x-2"
                : "text-white/50 hover:text-white/80 hover:translate-x-1"
            } ${heading.level === 3 ? "ml-4 text-xs opacity-80" : ""}`}
            onClick={(e) => {
              e.preventDefault();
              const element = document.getElementById(heading.id);
              if (element) {
                // Offset scroll by header height
                const y = element.getBoundingClientRect().top + window.scrollY - 120;
                window.scrollTo({ top: y, behavior: "smooth" });
                setActiveId(heading.id);
              }
            }}
          >
            {heading.text}
          </a>
        ))}
      </nav>
    </div>
  );
}