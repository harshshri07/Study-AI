import { Link } from "@tanstack/react-router";
import { Moon, Sun, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "./theme-provider";

export function Header() {
  const { theme, toggle } = useTheme();
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border/60">
      <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between px-4 md:px-8">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="relative h-7 w-7 rounded-md bg-foreground flex items-center justify-center">
            <span className="font-serif text-background text-base leading-none translate-y-[-1px]">S</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-[15px] font-semibold tracking-tight">StudyAI</span>
            <span className="hidden sm:inline text-[11px] text-muted-foreground font-mono uppercase tracking-wider">v0.1</span>
          </div>
        </Link>
        <div className="flex items-center gap-1">
          <Button asChild variant="ghost" size="sm" className="hidden md:inline-flex gap-1.5 text-muted-foreground hover:text-foreground">
            <Link to="/"><Plus className="h-3.5 w-3.5" /> New lecture</Link>
          </Button>
          <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme" className="h-8 w-8">
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </header>
  );
}
