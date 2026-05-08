import { useEffect, useRef } from "react";

/**
 * Canvas constellation: drifting particles connect with thin lines,
 * subtly attracted to the cursor. Editorial, calm, premium.
 */
export function AnimatedBackground({
  density = 70,
  className = "",
  interactive = true,
}: {
  density?: number;
  className?: string;
  interactive?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({ x: -9999, y: -9999, active: false });

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let raf = 0;
    let particles: Particle[] = [];
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round((rect.width * rect.height) / 22000) + density;
      particles = Array.from({ length: count }, () => spawn(rect.width, rect.height));
    }

    function spawn(w: number, h: number): Particle {
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.6 + 0.4,
        hue: Math.random() < 0.18 ? "primary" : "muted",
      };
    }

    function readColor(name: string) {
      const v = getComputedStyle(document.documentElement).getPropertyValue(`--${name}`).trim();
      return v || "#888";
    }

    function tick() {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);
      const primary = readColor("primary");
      const fg = readColor("foreground");
      const m = mouseRef.current;

      // update + draw particles
      for (const p of particles) {
        if (interactive && m.active) {
          const dx = m.x - p.x;
          const dy = m.y - p.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 22000) {
            const f = (1 - d2 / 22000) * 0.04;
            p.vx += dx * f * 0.01;
            p.vy += dy * f * 0.01;
          }
        }
        p.vx *= 0.985;
        p.vy *= 0.985;
        p.x += p.vx + (Math.random() - 0.5) * 0.05;
        p.y += p.vy + (Math.random() - 0.5) * 0.05;

        if (p.x < -10) p.x = rect.width + 10;
        if (p.x > rect.width + 10) p.x = -10;
        if (p.y < -10) p.y = rect.height + 10;
        if (p.y > rect.height + 10) p.y = -10;

        ctx.beginPath();
        ctx.fillStyle = p.hue === "primary"
          ? `oklch(from ${primary} l c h / 0.85)`
          : `oklch(from ${fg} l c h / 0.5)`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // connect nearby particles
      ctx.lineWidth = 0.6;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 11000) {
            const alpha = (1 - d2 / 11000) * 0.35;
            ctx.strokeStyle = `oklch(from ${fg} l c h / ${alpha.toFixed(3)})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // cursor halo
      if (interactive && m.active) {
        const grad = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, 180);
        grad.addColorStop(0, `oklch(from ${primary} l c h / 0.18)`);
        grad.addColorStop(1, `oklch(from ${primary} l c h / 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(m.x, m.y, 180, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(tick);
    }

    resize();
    raf = requestAnimationFrame(tick);
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    function onMove(e: MouseEvent) {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top, active: true };
    }
    function onLeave() { mouseRef.current.active = false; }
    if (interactive) {
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseleave", onLeave);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, [density, interactive]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      aria-hidden="true"
    />
  );
}

type Particle = { x: number; y: number; vx: number; vy: number; r: number; hue: "primary" | "muted" };

/**
 * Aurora — soft, slow, flowing color orbs behind everything.
 */
export function Aurora({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      <div className="absolute -top-40 -left-32 h-[600px] w-[600px] rounded-full opacity-40 blur-[140px] animate-float"
        style={{ background: "radial-gradient(circle, oklch(0.72 0.19 78 / 0.55), transparent 60%)" }} />
      <div className="absolute top-1/3 -right-40 h-[700px] w-[700px] rounded-full opacity-30 blur-[160px] animate-float"
        style={{ background: "radial-gradient(circle, oklch(0.55 0.22 320 / 0.35), transparent 60%)", animationDelay: "4s" }} />
      <div className="absolute -bottom-40 left-1/3 h-[560px] w-[560px] rounded-full opacity-35 blur-[140px] animate-float"
        style={{ background: "radial-gradient(circle, oklch(0.68 0.18 200 / 0.30), transparent 60%)", animationDelay: "8s" }} />
    </div>
  );
}
