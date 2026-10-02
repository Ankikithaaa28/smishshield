import { usePageTitle } from "@/lib/usePageTitle";

export default function HomePage() {
  usePageTitle("SmishShield — Detect SMS Phishing Attacks");
  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="text-4xl font-bold">
        Detect SMS phishing <span className="neon-text">before it costs you.</span>
      </h1>
      <p className="mt-4 text-muted-foreground">
        Landing page coming in the next commit.
      </p>
    </div>
  );
}
