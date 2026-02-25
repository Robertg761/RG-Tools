"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Github, Twitter, Linkedin } from "lucide-react";

export function Navbar() {
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-background/80 backdrop-blur-md border-b border-white/10"
    >
      <div className="text-xl font-bold tracking-tighter">
        <Link href="/">RG PROJECT DUMP</Link>
      </div>
      <nav className="hidden md:flex gap-8">
        <Link href="/#home" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
          Home
        </Link>
        <Link href="/#projects" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
          Projects
        </Link>
        <Link href="/#contact" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
          Contact
        </Link>
      </nav>
      <div className="flex gap-4">
        <Link href="https://github.com/Robertg761" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors">
          <Github size={20} />
        </Link>
        <Link href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors">
          <Linkedin size={20} />
        </Link>
        <Link href="https://x.com/Robertg761_" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors">
          <Twitter size={20} />
        </Link>
      </div>
    </motion.header>
  );
}
