"use client";

import { motion } from "framer-motion";
import { Mail, MessageSquare, ArrowRight } from "lucide-react";

export function Contact() {
  return (
    <section id="contact" className="py-24 px-6 relative overflow-hidden">
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="p-12 md:p-16 rounded-3xl bg-gradient-to-b from-white/10 to-transparent border border-white/10 text-center shadow-2xl"
        >
          <MessageSquare className="w-12 h-12 text-accent mx-auto mb-6" />
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">Let&apos;s Connect</h2>
          <p className="text-white/70 text-lg max-w-xl mx-auto mb-10">
            Have a project in mind, found a critical bug, or just want to chat about tech? My inbox is always open.
          </p>
          
          <a
            href="https://x.com/Robertg761_"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-white/90 transition-all hover:scale-105 active:scale-95 shadow-xl"
          >
            <Mail size={20} />
            Say Hello on X
            <ArrowRight size={20} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}