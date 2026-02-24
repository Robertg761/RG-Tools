"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, TerminalSquare } from "lucide-react";

interface ProjectMediaGalleryProps {
  images: string[];
}

export function ProjectMediaGallery({ images }: ProjectMediaGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const handleNext = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex + 1) % images.length);
  }, [selectedIndex, images.length]);

  const handlePrev = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex - 1 + images.length) % images.length);
  }, [selectedIndex, images.length]);

  const handleClose = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    // Prevent scrolling when lightbox is open
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [selectedIndex, handleNext, handlePrev, handleClose]);

  if (images.length === 0) {
    return (
      <div className="rounded-3xl bg-white/5 border border-white/10 p-10 text-center flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-6">
          <TerminalSquare size={24} className="text-white/40" />
        </div>
        <h4 className="text-lg font-bold text-white/80 mb-2">No Visual Media</h4>
        <p className="text-sm text-white/50 text-center leading-relaxed">
          This repository doesn&apos;t have any screenshots or images in its documentation to display.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-8">
        {images.map((img, i) => (
          <div 
            key={i} 
            onClick={() => setSelectedIndex(i)}
            className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl group relative bg-black/50 cursor-pointer"
          >
            <div className="absolute inset-0 bg-accent/20 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={img} 
              alt={`Project Screenshot ${i + 1}`} 
              className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {mounted && createPortal(
        <AnimatePresence>
          {selectedIndex !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 md:p-8"
              onClick={handleClose}
            >
              <button 
                onClick={handleClose}
                className="absolute top-6 right-6 md:top-8 md:right-8 z-[110] p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
              >
                <X size={24} />
              </button>

              {images.length > 1 && (
                <>
                  <button 
                    onClick={handlePrev}
                    className="absolute left-4 md:left-8 z-[110] p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                  >
                    <ChevronLeft size={32} />
                  </button>
                  <button 
                    onClick={handleNext}
                    className="absolute right-4 md:right-8 z-[110] p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                  >
                    <ChevronRight size={32} />
                  </button>
                </>
              )}

              <motion.div
                key={selectedIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="relative max-w-full max-h-full flex items-center justify-center"
                onClick={(e) => e.stopPropagation()} // Prevent click from closing when clicking the image
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={images[selectedIndex]} 
                  alt={`Expanded Screenshot ${selectedIndex + 1}`} 
                  className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl border border-white/10"
                />
                
                <div className="absolute bottom-[-40px] left-0 right-0 text-center text-white/50 text-sm font-medium">
                  {selectedIndex + 1} of {images.length}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}