export function Footer() {
  return (
    <footer className="w-full py-8 border-t border-white/10 mt-20 flex flex-col items-center justify-center gap-2">
      <p className="text-white/50 text-sm">
        © {new Date().getFullYear()} My Portfolio. Built with Next.js, Tailwind, and Three.js.
      </p>
    </footer>
  );
}