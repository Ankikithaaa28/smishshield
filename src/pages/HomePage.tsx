import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRight,
  Link2,
  MessageSquareWarning,
  ScanLine,
  Shield,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { usePageTitle } from "@/lib/usePageTitle";

const STATS = [
  { value: "76%", label: "of orgs hit by smishing in the last year", icon: TrendingUp },
  { value: "₹1,750cr+", label: "lost to cyber fraud in India (2024)", icon: AlertTriangle },
  { value: "5×", label: "rise in fake KYC & delivery SMS scams", icon: MessageSquareWarning },
];

const TOOLS = [
  {
    to: "/detector" as const,
    icon: ScanLine,
    title: "SMS Detector",
    desc: "Paste any message. We grade it Safe / Suspicious / Dangerous and explain exactly why.",
  },
  {
    to: "/scanner" as const,
    icon: Link2,
    title: "Link Scanner",
    desc: "Inspect URLs for shorteners, lookalike domains and banking-bait keywords.",
  },
];

export default function HomePage() {
  usePageTitle("SmishShield — Detect SMS Phishing Attacks");

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="grid-bg absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 pt-14 sm:pt-20 pb-14">
          {/* Live threat ticker */}
          <div className="mb-8 flex justify-center">
            <div className="glass flex items-center gap-2 rounded-full border border-destructive/40 px-4 py-1.5 text-xs sm:text-sm">
              <span className="h-2 w-2 animate-blink rounded-full bg-destructive" />
              <span>
                <strong className="text-destructive">Active threat:</strong> Fake OTP & KYC
                update scams are surging. Never share OTPs.
              </span>
            </div>
          </div>

          <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
            {/* Copy */}
            <div>
              <div className="mb-4 inline-flex items-center gap-2 font-mono text-xs text-primary">
                <Sparkles className="h-3.5 w-3.5" /> CYBERSECURITY AWARENESS
              </div>
              <h1 className="text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                Detect SMS phishing
                <br />
                <span className="neon-text">before it costs you.</span>
              </h1>
              <p className="mt-5 max-w-xl text-lg text-muted-foreground">
                SmishShield analyzes suspicious SMS messages and links in real time, flags
                red flags, and shows you exactly why a message is risky — entirely in your
                browser.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/detector"
                  className="group inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground neon-border transition hover:scale-[1.02]"
                >
                  <ScanLine className="h-4 w-4" />
                  Check a Message
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </Link>
                <Link
                  to="/scanner"
                  className="inline-flex items-center gap-2 rounded-md border border-border bg-secondary/40 px-5 py-3 text-sm font-semibold transition hover:bg-secondary"
                >
                  <Link2 className="h-4 w-4" />
                  Scan a Link
                </Link>
              </div>
            </div>

            {/* Inspector panel */}
            <div className="relative mx-auto aspect-square w-full max-w-md">
              <div className="absolute inset-0 rounded-full bg-primary/10 blur-3xl" />
              <div className="glass relative h-full w-full overflow-hidden rounded-3xl">
                <div className="grid-bg absolute inset-0 opacity-50" />

                <div className="relative flex h-full flex-col p-6">
                  <div className="mb-2 font-mono text-[10px] text-primary">
                    // SMS_INSPECTOR.exe
                  </div>
                  <div className="space-y-2 font-mono text-xs">
                    <div className="text-muted-foreground">&gt; scanning inbox…</div>
                    <div className="text-warning">[ ! ] sender: +91-XXX-FAKE-BNK</div>
                    <div className="rounded-md border border-border bg-background/50 p-3 leading-relaxed">
                      "URGENT: Your KYC is expiring today. Verify immediately at{" "}
                      <span className="text-destructive">http://sbi-kyc.click/x9</span> or
                      account will be blocked."
                    </div>
                    <div className="flex items-center gap-2 text-destructive">
                      <span className="h-2 w-2 animate-blink rounded-full bg-destructive" />
                      VERDICT: DANGEROUS · 92%
                    </div>
                    <div className="border-t border-border/50 pt-2 text-muted-foreground">
                      ✗ KYC update bait
                      <br />
                      ✗ Suspicious .click TLD
                      <br />
                      ✗ Urgency pressure
                    </div>
                  </div>

                  <div className="mt-auto flex items-center gap-2 pt-4 font-mono text-[10px] text-muted-foreground">
                    <Shield className="h-3 w-3 text-primary" />
                    Protected by SmishShield
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
        <div className="grid gap-4 sm:grid-cols-3">
          {STATS.map((stat) => (
            <div key={stat.label} className="glass rounded-xl p-6 transition hover:neon-border">
              <stat.icon className="mb-3 h-6 w-6 text-primary" />
              <div className="text-3xl font-bold neon-text">{stat.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* TOOLS */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
        <h2 className="mb-8 text-2xl font-bold sm:text-3xl">Your defense toolkit</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {TOOLS.map((tool) => (
            <Link
              key={tool.to}
              to={tool.to}
              className="glass group flex items-start gap-4 rounded-xl p-6 transition hover:neon-border"
            >
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary transition group-hover:scale-110">
                <tool.icon className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{tool.title}</h3>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" />
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{tool.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-14">
        <div className="glass neon-border rounded-2xl p-8 text-center sm:p-12">
          <h3 className="text-2xl font-bold sm:text-3xl">
            Got a suspicious SMS right now?
          </h3>
          <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
            Don't click. Don't reply. Drop it into the SMS Detector first.
          </p>
          <Link
            to="/detector"
            className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:scale-[1.02]"
          >
            Check it now <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
