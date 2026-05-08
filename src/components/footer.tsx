export function Footer() {
  return (
    <footer className="border-t border-border/60 py-8 mt-16">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
        <p className="font-mono uppercase tracking-wider">
          StudyAI <span className="mx-2 opacity-40">/</span> Cloudforce Hackathon 2026
        </p>
        <p className="font-mono uppercase tracking-wider opacity-70">
          Crafted for curious learners
        </p>
      </div>
    </footer>
  );
}
