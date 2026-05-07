import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Map, Loader2, ArrowRight, AlertTriangle } from "lucide-react";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { curriculumMap } from "@/lib/api";
import { useUnlock } from "@/lib/store";
import { mockCurriculumMap } from "@/lib/mock-data";

export const Route = createFileRoute("/provost")({
  component: ProvostPage,
});

function ProvostPage() {
  const { unlocks } = useUnlock();
  const [urls, setUrls] = useState("https://youtube.com/watch?v=kCc8FmEb1nY\nhttps://youtube.com/watch?v=aircAruvnKk\nhttps://youtube.com/watch?v=ErnWZxJovaM");
  const [objectives, setObjectives] = useState("Explain attention mechanisms\nImplement a transformer in code\nReason about training stability\nCompare model architectures");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<typeof mockCurriculumMap | null>(null);

  const run = async () => {
    setLoading(true);
    const r = await curriculumMap(urls.split("\n").filter(Boolean), objectives.split("\n").filter(Boolean));
    setReport(r);
    setLoading(false);
  };

  if (!unlocks.provost) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <div className="font-serif text-3xl mb-2">Provost Map is locked</div>
        <p className="text-sm text-muted-foreground max-w-sm">
          Use the sidebar to enter your institution code (try <span className="font-mono">PROVOST-2026</span>).
        </p>
      </div>
    );
  }

  const colorFor = (pct: number) =>
    pct >= 70 ? "bg-success/30 text-success" : pct >= 40 ? "bg-warning/30 text-warning" : pct > 0 ? "bg-destructive/20 text-destructive" : "bg-surface text-muted-foreground/60";

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 mx-auto w-full max-w-[1200px] px-4 md:px-8 py-10">
        <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-muted-foreground mb-3 flex items-center gap-1.5">
          <Map className="h-3 w-3 text-primary" /> Creator tools
        </div>
        <h1 className="font-serif text-4xl md:text-5xl tracking-tight leading-[1.05] mb-3">
          Provost <em className="text-primary">Map</em>
        </h1>
        <p className="text-muted-foreground max-w-xl mb-8">
          Map multiple lectures against learning objectives to spot curriculum coherence and gaps.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="surface rounded-xl p-3">
            <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-2 px-1">Video URLs (one per line)</div>
            <textarea
              value={urls}
              onChange={(e) => setUrls(e.target.value)}
              rows={6}
              className="w-full bg-transparent border-0 outline-none p-2 text-sm font-mono resize-none"
            />
          </div>
          <div className="surface rounded-xl p-3">
            <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-2 px-1">Learning objectives (one per line)</div>
            <textarea
              value={objectives}
              onChange={(e) => setObjectives(e.target.value)}
              rows={6}
              className="w-full bg-transparent border-0 outline-none p-2 text-sm resize-none"
            />
          </div>
        </div>
        <Button variant="hero" onClick={run} disabled={loading} className="gap-1.5 mb-8">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Build map <ArrowRight className="h-4 w-4" /></>}
        </Button>

        {report && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            <div className="surface rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-surface-elevated">
                  <tr>
                    <th className="text-left p-3 text-xs font-mono uppercase tracking-wider text-muted-foreground">Video</th>
                    {report.objectives.map((o) => (
                      <th key={o} className="text-left p-3 text-xs font-mono uppercase tracking-wider text-muted-foreground max-w-[180px]">{o}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {report.videos.map((v) => (
                    <tr key={v.id} className="border-t border-border">
                      <td className="p-3 text-sm">
                        <div className={v.status === "error" ? "text-destructive" : ""}>{v.title}</div>
                        {v.status === "error" && (
                          <div className="text-[10px] text-destructive/80 flex items-center gap-1 mt-0.5">
                            <AlertTriangle className="h-3 w-3" /> {v.error}
                          </div>
                        )}
                      </td>
                      {v.coverage.map((c, i) => (
                        <td key={i} className="p-3">
                          <div className={`inline-flex items-center px-2 py-1 rounded-md font-mono text-xs tabular-nums ${colorFor(c)}`}>
                            {c}%
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {report.gaps.length > 0 && (
              <div className="surface rounded-xl p-5">
                <h3 className="font-serif text-xl mb-3 flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-warning" /> Coverage gaps</h3>
                <ul className="space-y-2 text-sm text-foreground/85">
                  {report.gaps.map((g, i) => (
                    <li key={i}><span className="font-medium">{g.objective}</span> — <span className="text-muted-foreground">{g.note}</span></li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        )}
      </main>
      <Footer />
    </div>
  );
}
