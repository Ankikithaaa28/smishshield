import { useMemo, useState } from "react";
import { Globe, Loader2, Link2 } from "lucide-react";
import { analyzeUrl } from "@/lib/detection";
import AnalysisCard from "@/components/AnalysisCard";
import { usePageTitle } from "@/lib/usePageTitle";

const SAMPLES = [
  "http://sbi-kyc.click/verify-account-now",
  "https://www.google.com",
  "bit.ly/3xZk-bank-secure-update",
];

export default function ScannerPage() {
  usePageTitle("Link Scanner — SmishShield");

  const [url, setUrl] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [scanning, setScanning] = useState(false);

  const result = useMemo(() => (submitted ? analyzeUrl(submitted) : null), [submitted]);

  const handleScan = () => {
    if (!url.trim() || scanning) return;
    setScanning(true);
    setTimeout(() => {
      setSubmitted(url);
      setScanning(false);
    }, 500);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12 sm:py-16">
      <header className="mb-8">
        <div className="mb-3 inline-flex items-center gap-2 font-mono text-xs text-primary">
          <Link2 className="h-3.5 w-3.5" /> LINK SCANNER
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
          Scan a <span className="neon-text">link</span>.
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Inspect any URL for shorteners, suspicious domains, banking-bait keywords and
          other phishing indicators.
        </p>
      </header>

      <div className="glass rounded-xl p-5 sm:p-6">
        <label htmlFor="url" className="text-sm font-medium">
          URL to inspect
        </label>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              id="url"
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleScan()}
              placeholder="http://example.com/verify"
              className="w-full rounded-md border border-border bg-input/60 py-2.5 pl-9 pr-3 font-mono text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <button
            type="button"
            onClick={handleScan}
            disabled={!url.trim() || scanning}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {scanning ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Inspecting…
              </>
            ) : (
              <>
                <Link2 className="h-4 w-4" /> Scan link
              </>
            )}
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {SAMPLES.map((sample, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setUrl(sample)}
              className="rounded-md border border-border bg-secondary/40 px-2.5 py-1 font-mono text-xs text-muted-foreground transition hover:bg-secondary hover:text-foreground"
            >
              {sample}
            </button>
          ))}
        </div>
      </div>

      {result && (
        <div className="mt-6">
          <AnalysisCard analysis={result} />
        </div>
      )}
    </div>
  );
}
