import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ClipboardCheck, Loader2, ArrowRight, Check, AlertTriangle } from "lucide-react";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { facultyAudit } from "@/lib/api";
import { useUnlock } from "@/lib/store";
import { mockFacultyAudit } from "@/lib/mock-data";

export const Route = createFileRoute("/faculty")({
  component: FacultyPage,
});

function FacultyPage() {
  const { unlocks } = useUnlock();
  const [url, setUrl] = useState("https://youtube.com/watch?v=kCc8FmEb1nY");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<typeof mockFacultyAudit | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("studyai.faculty.report");
    if (stored) setReport(JSON.parse(stored));
  }, []);

  const run = async () => {
    setLoading(true);
    const r = await facultyAudit(url);
    setReport(r);
    localStorage.setItem("studyai.faculty.report", JSON.stringify(r));
    setLoading(false);
  };

  if (!unlocks.faculty) {
    return <Locked title="Faculty Audit" />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 mx-auto w-full max-w-[1100px] px-4 md:px-8 py-10">
        <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-muted-foreground mb-3 flex items-center gap-1.5">
          <ClipboardCheck className="h-3 w-3 text-primary" /> Creator tools
        </div>
        <h1 className="font-serif text-4xl md:text-5xl tracking-tight leading-[1.05] mb-3">
          Faculty <em className="text-primary">Audit</em>
        </h1>
        <p className="text-muted-foreground max-w-xl mb-8">
          Evaluate a lecture's teaching quality from transcript and metadata. Bloom coverage, clarity, structure, and concrete improvements.
        </p>

        <div className="surface rounded-xl p-2 flex items-center gap-2 mb-8 max-w-2xl">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="youtube.com/watch?v=..."
            className="flex-1 bg-transparent border-0 outline-none px-3 py-2 text-sm"
          />
          <Button variant="hero" size="sm" onClick={run} disabled={loading} className="gap-1.5">
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <>Run audit <ArrowRight className="h-3.5 w-3.5" /></>}
          </Button>
        </div>

        {report && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="surface-elevated rounded-2xl p-6 md:col-span-1 flex flex-col items-center justify-center text-center">
                <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-2">Overall</div>
                <div className="font-serif text-7xl tabular-nums text-primary">{report.overall}</div>
                <div className="text-xs text-muted-foreground mt-2">{report.title}</div>
              </div>
              <div className="surface rounded-2xl p-6 md:col-span-2 grid grid-cols-2 gap-x-6 gap-y-3">
                {Object.entries(report.scores).map(([k, v]) => (
                  <div key={k}>
                    <div className="flex items-baseline justify-between mb-1">
                      <span className="text-sm capitalize">{k}</span>
                      <span className="font-mono text-sm tabular-nums">{v}</span>
                    </div>
                    <div className="h-1.5 bg-border rounded-full overflow-hidden">
                      <div className="h-full gradient-warm" style={{ width: `${v}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="surface rounded-xl p-5">
                <h3 className="font-serif text-xl mb-3 flex items-center gap-2"><Check className="h-4 w-4 text-success" /> Strengths</h3>
                <ul className="space-y-2 text-sm text-foreground/85">
                  {report.strengths.map((s, i) => <li key={i} className="leading-relaxed">— {s}</li>)}
                </ul>
              </div>
              <div className="surface rounded-xl p-5">
                <h3 className="font-serif text-xl mb-3 flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-warning" /> Improvements</h3>
                <ul className="space-y-2 text-sm text-foreground/85">
                  {report.improvements.map((s, i) => <li key={i} className="leading-relaxed">— {s}</li>)}
                </ul>
              </div>
            </div>

            <div className="surface rounded-xl p-5">
              <h3 className="font-serif text-xl mb-4">Bloom's coverage</h3>
              <div className="space-y-2">
                {report.bloomCoverage.map((b) => (
                  <div key={b.level} className="flex items-center gap-3">
                    <span className="text-xs w-24 text-muted-foreground">{b.level}</span>
                    <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${b.pct}%` }} />
                    </div>
                    <span className="font-mono text-xs tabular-nums w-10 text-right">{b.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </main>
      <Footer />
    </div>
  );
}

function Locked({ title }: { title: string }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <div className="font-serif text-3xl mb-2">{title} is locked</div>
      <p className="text-sm text-muted-foreground max-w-sm">
        Use the sidebar to enter your institution code (try <span className="font-mono">FACULTY-2026</span>).
      </p>
    </div>
  );
}
