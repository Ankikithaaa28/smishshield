import {
  Banknote,
  Briefcase,
  IdCard,
  KeyRound,
  Package,
  ShieldCheck,
} from "lucide-react";
import { usePageTitle } from "@/lib/usePageTitle";

const ATTACK_TYPES = [
  {
    icon: Banknote,
    title: "Banking scams",
    text: "Messages impersonating banks claiming your account is blocked or a transaction failed.",
    example:
      '"Dear customer, your A/C will be debited ₹49,999. To cancel, click http://sbi-secure.xyz/cancel"',
  },
  {
    icon: Package,
    title: "Fake delivery messages",
    text: "Fake courier/postal notices with a 'failed delivery' link asking for fees or your address.",
    example:
      '"India Post: Your parcel is held due to incomplete address. Update: http://indpost-tracking.click"',
  },
  {
    icon: KeyRound,
    title: "OTP fraud",
    text: "Asks you to share an OTP to 'verify' or 'cancel' a transaction. Real banks NEVER ask for OTPs.",
    example: '"Don\'t share OTP — but please share OTP 482911 with our agent to stop fraud."',
  },
  {
    icon: Briefcase,
    title: "Job scams",
    text: "Unsolicited 'work from home' offers that demand a registration fee upfront.",
    example: '"Hi! Earn ₹4,000/day part-time. Reply YES on WhatsApp +91-XXXXXXXXXX"',
  },
  {
    icon: IdCard,
    title: "KYC update scams",
    text: "Threatens account suspension unless you 'update KYC' through a fake link.",
    example:
      '"Your KYC has expired. Update within 24h or your wallet will be deactivated: http://kyc-update.top"',
  },
];

const TIPS = [
  "Banks NEVER ask for OTPs, PINs, CVV or passwords — by SMS, call or email.",
  "Long-press links to preview the real URL. Watch for .xyz, .click, .top, shorteners and raw IPs.",
  "Urgency is the red flag. Real institutions don't give you 30 minutes to act.",
  "Verify by calling the number on the back of your card or the official website — not the one in the SMS.",
  "Report scams at 1930 (cybercrime.gov.in) and to your mobile operator at 1909.",
  "If you clicked: disconnect data, change passwords, freeze your card, and file a complaint within 24 hours.",
];

export default function GuidePage() {
  usePageTitle("What is Smishing? — SmishShield");

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12 sm:py-16">
      <header className="mb-12">
        <div className="mb-3 inline-flex items-center gap-2 font-mono text-xs text-primary">
          <ShieldCheck className="h-3.5 w-3.5" /> SMISHING 101
        </div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          What is <span className="neon-text">smishing</span>?
        </h1>
        <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
          Smishing = <strong>SMS</strong> + <strong>phishing</strong>. Fraudsters text you a
          link or phone number designed to steal passwords, OTPs or money. The message
          looks like it's from your bank, a courier, or a government service — it isn't.
        </p>
      </header>

      {/* Attack types */}
      <section className="mb-14">
        <h2 className="mb-6 text-2xl font-bold">The 5 most common attacks</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {ATTACK_TYPES.map((type) => (
            <div key={type.title} className="glass rounded-xl p-5">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                  <type.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold">{type.title}</h3>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{type.text}</p>
              <p className="mt-3 rounded-md border border-border/60 bg-background/40 p-3 font-mono text-xs text-warning">
                {type.example}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Tips */}
      <section>
        <h2 className="mb-6 text-2xl font-bold">How to protect yourself</h2>
        <ul className="space-y-3">
          {TIPS.map((tip) => (
            <li
              key={tip}
              className="glass flex items-start gap-3 rounded-lg p-4 text-sm"
            >
              <span className="mt-0.5 text-primary">✔</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>

        <div className="glass mt-8 rounded-xl p-5 text-sm text-muted-foreground">
          🚨 <strong className="text-foreground">Already clicked?</strong> Call{" "}
          <strong className="text-foreground">1930</strong> or report at{" "}
          <a
            href="https://cybercrime.gov.in"
            target="_blank"
            rel="noreferrer"
            className="text-primary underline"
          >
            cybercrime.gov.in
          </a>{" "}
          within 24 hours — and block/freeze your cards immediately.
        </div>
      </section>
    </div>
  );
}
