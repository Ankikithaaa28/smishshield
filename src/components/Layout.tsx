import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Shield } from "lucide-react";

const NAV_ITEMS = [
  { to: "/", label: "Home" },
  { to: "/detector", label: "Detector" },
  { to: "/scanner", label: "Scanner" },
  { to: "/about", label: "Guide" },
] as const;

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="glass sticky top-0 z-40 border-b border-border/60">
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 h-14">
          <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <Shield className="h-5 w-5 text-primary" />
            <span>
              Smish<span className="text-primary">Shield</span>
            </span>
          </Link>

          <div className="flex items-center gap-1 text-sm">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeProps={{ className: "text-primary" }}
                className="rounded-md px-3 py-1.5 text-muted-foreground transition hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border/60 py-6">
        <p className="mx-auto max-w-5xl px-4 text-center text-sm text-muted-foreground">
          🛡️ SmishShield — analysis runs 100% in your browser. Never share OTPs, PINs or
          passwords with anyone.
        </p>
      </footer>
    </div>
  );
}
