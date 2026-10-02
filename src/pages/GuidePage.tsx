import { usePageTitle } from "@/lib/usePageTitle";

export default function GuidePage() {
  usePageTitle("What is Smishing? — SmishShield");
  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="text-3xl font-bold">What is smishing?</h1>
      <p className="mt-3 text-muted-foreground">Guide coming in the next commit.</p>
    </div>
  );
}
