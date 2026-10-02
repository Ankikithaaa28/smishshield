import { usePageTitle } from "@/lib/usePageTitle";

export default function ScannerPage() {
  usePageTitle("Link Scanner — SmishShield");
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-3xl font-bold">Link Scanner</h1>
      <p className="mt-3 text-muted-foreground">Interface coming in the next commit.</p>
    </div>
  );
}
