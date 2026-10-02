import { Link } from "@tanstack/react-router";
import { usePageTitle } from "@/lib/usePageTitle";

export default function NotFoundPage() {
  usePageTitle("Page not found — SmishShield");
  return (
    <div className="mx-auto max-w-5xl px-4 py-24 text-center">
      <p className="text-6xl font-bold text-primary neon-text">404</p>
      <p className="mt-4 text-muted-foreground">This page doesn't exist.</p>
      <Link
        to="/"
        className="mt-6 inline-block rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
      >
        Back to safety
      </Link>
    </div>
  );
}
