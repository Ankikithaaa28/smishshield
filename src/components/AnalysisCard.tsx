import { ShieldAlert, ShieldCheck, ShieldX } from "lucide-react";
import type { Analysis, RiskLevel, SignalCategory } from "@/lib/detection";

const LEVEL_STYLE: Record<
  RiskLevel,
  { label: string; badge: string; bar: string; icon: typeof ShieldCheck }
> = {
  safe: {
    label: "SAFE",
    badge: "border-primary/40 bg-primary/10 text-primary",
    bar: "bg-primary",
    icon: ShieldCheck,
  },
  suspicious: {
    label: "SUSPICIOUS",
    badge: "border-warning/40 bg-warning/10 text-warning",
    bar: "bg-warning",
    icon: ShieldAlert,
  },
  dangerous: {
    label: "DANGEROUS",
    badge: "border-destructive/40 bg-destructive/10 text-destructive",
    bar: "bg-destructive",
    icon: ShieldX,
  },
};

const CATEGORY_LABELS: Record<SignalCategory, string> = {
  "credential-theft": "Credential theft",
  urgency: "Urgency",
  impersonation: "Impersonation",
  bait: "Bait",
  pressure: "Pressure",
  style: "Style",
};

export default function AnalysisCard({ analysis }: { analysis: Analysis }) {
  const { score, level, signals } = analysis;
  const style = LEVEL_STYLE[level];
  const Icon = style.icon;

  return (
    <div className="glass rounded-xl p-5 sm:p-6">
      {/* Verdict header */}
      <div className="flex items-center justify-between gap-4">
        <span
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold tracking-wide ${style.badge}`}
        >
          <Icon className="h-4 w-4" />
          {style.label}
        </span>
        <div className="text-right">
          <span className="text-3xl font-bold">{score}</span>
          <span className="text-sm text-muted-foreground">/100</span>
          <div className="text-[11px] uppercase tracking-widest text-muted-foreground">
            risk score
          </div>
        </div>
      </div>

      {/* Score meter */}
      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full transition-all duration-500 ${style.bar}`}
          style={{ width: `${score}%` }}
        />
      </div>

      {/* Why */}
      <div className="mt-5">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Why we flagged this
        </h3>

        {signals.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">
            No red flags found — but always verify the sender before acting on a message.
          </p>
        ) : (
          <ul className="mt-3 space-y-2">
            {signals.map((signal, i) => (
              <li
                key={`${signal.id}-${i}`}
                className="flex items-start gap-3 rounded-md border border-border/60 bg-background/40 p-3"
              >
                <span className="mt-0.5 shrink-0 rounded bg-destructive/15 px-1.5 py-0.5 font-mono text-xs font-semibold text-destructive">
                  +{signal.weight}
                </span>
                <div className="min-w-0">
                  <p className="text-sm">{signal.explanation}</p>
                  <p className="mt-0.5 text-[11px] uppercase tracking-wide text-muted-foreground">
                    {CATEGORY_LABELS[signal.category]}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
