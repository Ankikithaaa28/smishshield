import { useMemo, useState } from "react";
import { Loader2, ScanLine } from "lucide-react";
import { analyzeSms } from "@/lib/detection";
import AnalysisCard from "@/components/AnalysisCard";
import { usePageTitle } from "@/lib/usePageTitle";

const SAMPLES = [
  "Dear customer, your KYC is expiring today. Verify immediately at http://sbi-kyc.click/x9 or your account will be blocked.",
  "Hi! Got time today? Want to grab coffee at 5pm?",
  "URGENT: You won Rs.50,00,000 in KBC lottery. Send your bank details and OTP 482911 to claim your prize now!",
];

export default function DetectorPage() {
  usePageTitle("SMS Detector — SmishShield");

  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [scanning, setScanning] = useState(false);

  const result = useMemo(() => (submitted ? analyzeSms(submitted) : null), [submitted]);

  const handleScan = () => {
    if (!text.trim() || scanning) return;
    setScanning(true);
    // Brief pause so the scan reads as a deliberate action, not an instant flicker.
    setTimeout(() => {
      setSubmitted(text);
      setScanning(false);
    }, 500);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12 sm:py-16">
      <header className="mb-8">
        <div className="mb-3 inline-flex items-center gap-2 font-mono text-xs text-primary">
          <ScanLine className="h-3.5 w-3.5" /> SMS DETECTOR
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
          Check a <span className="neon-text">message</span>.
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Paste the SMS you received. We'll analyze it for smishing red flags and rate the
          risk in real time — nothing ever leaves your browser.
        </p>
      </header>

      <div className="glass rounded-xl p-5 sm:p-6">
        <label htmlFor="sms" className="text-sm font-medium">
          SMS content
        </label>
        <textarea
          id="sms"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder='e.g. "Your KYC is expiring today. Verify at http://kyc-update.top"'
          rows={5}
          className="mt-2 w-full resize-none rounded-md border border-border bg-input/60 px-3 py-2.5 font-mono text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
        />

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {SAMPLES.map((sample, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setText(sample)}
                className="rounded-md border border-border bg-secondary/40 px-2.5 py-1 text-xs text-muted-foreground transition hover:bg-secondary hover:text-foreground"
              >
                Try sample #{i + 1}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleScan}
            disabled={!text.trim() || scanning}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {scanning ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Analyzing…
              </>
            ) : (
              <>
                <ScanLine className="h-4 w-4" /> Scan message
              </>
            )}
          </button>
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
