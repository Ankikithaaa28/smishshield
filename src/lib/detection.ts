/**
 * SmishShield detection engine.
 *
 * Heuristic analysis of SMS messages and URLs — runs entirely on the client,
 * so no message ever leaves the device.
 *
 * Design:
 *  - Each pattern ("signal") has a weight reflecting how strongly it indicates
 *    a smishing attempt. Credential requests score highest because sharing an
 *    OTP/PIN/CVV is the single most damaging thing a victim can do.
 *  - Signals accumulate into a 0–100 score (capped).
 *  - Thresholds: score >= 60 → dangerous, >= 25 → suspicious, else safe.
 *    25 ≈ one or two weak indicators; 60 ≈ multiple strong ones (e.g. a bank
 *    impersonating message that demands urgent verification through a link).
 */

export type RiskLevel = "safe" | "suspicious" | "dangerous";

export type SignalCategory =
  | "credential-theft"
  | "urgency"
  | "impersonation"
  | "bait"
  | "pressure"
  | "style";

export interface SmishingSignal {
  /** Stable id so the UI/tests can reference the signal, not the regex. */
  id: string;
  pattern: RegExp;
  /** Points contributed when the pattern matches (0–100 scale). */
  weight: number;
  /** Plain-English reason shown to the user. */
  explanation: string;
  category: SignalCategory;
}

export interface ScoredSignal {
  id: string;
  weight: number;
  explanation: string;
  category: SignalCategory;
}

export interface Analysis {
  /** 0–100 risk score. */
  score: number;
  level: RiskLevel;
  signals: ScoredSignal[];
}

/** SMS red-flag catalogue, ordered by weight (strongest first). */
export const SMS_SIGNALS: readonly SmishingSignal[] = [
  {
    id: "asks-card-secret",
    pattern: /\bcvv\b|card\s*number|\bpin\b|\bpassword\b|atm\s*pin/i,
    weight: 22,
    explanation:
      "Asks for a card PIN, CVV or password — no legitimate organisation ever asks for these.",
    category: "credential-theft",
  },
  {
    id: "asks-otp",
    pattern: /\botp\b|one[\s-]?time[\s-]?password/i,
    weight: 18,
    explanation:
      "Mentions an OTP — OTPs are for typing into a bank's own page, never for sharing.",
    category: "credential-theft",
  },
  {
    id: "identity-verification",
    pattern: /\bverify\b.{0,25}\b(account|kyc|aadhaar|pan|identity)\b|\bkyc\b.{0,25}(expir|updat|verif|pending)/i,
    weight: 18,
    explanation: "Demands verification of KYC / Aadhaar / PAN details — a staple of Indian smishing.",
    category: "credential-theft",
  },
  {
    id: "prize-bait",
    pattern: /\b(lottery|prize|winner|won|cashback|reward)\b/i,
    weight: 16,
    explanation: "Promises a prize or reward — classic bait to make you act emotionally.",
    category: "bait",
  },
  {
    id: "artificial-urgency",
    pattern: /\b(urgent|immediately|within\s*\d+\s*(hr|hour|min)|today only|expires? (today|soon))\b/i,
    weight: 15,
    explanation: "Creates artificial urgency so you act before thinking.",
    category: "urgency",
  },
  {
    id: "click-here",
    pattern: /\b(click|tap)\s*(here|the link|below|this link)\b|link\s*(diye|par)/i,
    weight: 14,
    explanation: "Pushes you to click an unfamiliar link.",
    category: "pressure",
  },
  {
    id: "account-threat",
    pattern: /\b(suspend(ed)?|block(ed)?|deactivat(e|ed)|close(d)? your)\b/i,
    weight: 14,
    explanation: "Threatens account suspension to pressure you into acting.",
    category: "pressure",
  },
  {
    id: "fake-delivery",
    pattern: /\b(delivery|parcel|package)\b.{0,30}\b(failed|pending|held|undelivered)\b|\breschedule\b/i,
    weight: 12,
    explanation: "Fake delivery-failure notifications are one of the most common smishing lures.",
    category: "bait",
  },
  {
    id: "refund-lure",
    pattern: /\b(refund|reimburse)\b/i,
    weight: 12,
    explanation: "Fake refund lures trick you into 'verifying' payment details.",
    category: "bait",
  },
  {
    id: "loan-offer",
    pattern: /\b(instant|pre[- ]?approved)\s+loan|loan\s+(approved|offer)\b/i,
    weight: 12,
    explanation: "Unsolicited loan offers often lead to fee-fraud or data harvesting.",
    category: "bait",
  },
  {
    id: "job-offer",
    pattern: /\b(work from home|part[- ]?time job|job\s*(offer|opening|vacancy))\b/i,
    weight: 10,
    explanation: "Unsolicited job offers via SMS are frequently fraudulent.",
    category: "bait",
  },
  {
    id: "brand-impersonation",
    pattern: /\b(sbi|hdfc|icici|axis|kotak|paytm|phonepe|gpay|amazon|flipkart|india post|rbi)\b/i,
    weight: 8,
    explanation: "Impersonates a well-known bank, payment or e-commerce brand.",
    category: "impersonation",
  },
  {
    id: "unknown-callback",
    pattern: /\bcall\s*(us\s*)?on\s*\+?\d[\d\s-]{6,}|\bwhatsapp\s*\+?\d{10,}/i,
    weight: 8,
    explanation: "Directs you to call or message an unknown number.",
    category: "pressure",
  },
  {
    id: "all-caps",
    pattern: /\b[A-Z]{6,}\b/,
    weight: 4,
    explanation: "Shouting in ALL CAPS — common in scam messages.",
    category: "style",
  },
] as const;

/** Risk thresholds. Kept as one source of truth so UI and tests agree. */
export const THRESHOLDS = { dangerous: 60, suspicious: 25 } as const;

export function levelForScore(score: number): RiskLevel {
  if (score >= THRESHOLDS.dangerous) return "dangerous";
  if (score >= THRESHOLDS.suspicious) return "suspicious";
  return "safe";
}

/** Matches a URL inside free text (http(s), www., or bare domains). */
const URL_PATTERN =
  /\b(?:https?:\/\/|www\.)\S+|\b[a-z0-9-]+\.(?:com|in|net|org|info|xyz|click|link|online|site|top|live|shop|tk|cn|ru)\S*/gi;

/**
 * Analyses an SMS message and returns a score, level and the exact
 * signals that contributed.
 */
export function analyzeSms(input: string): Analysis {
  const text = input.trim();
  if (!text) return { score: 0, level: "safe", signals: [] };

  const signals: ScoredSignal[] = [];

  for (const signal of SMS_SIGNALS) {
    if (signal.pattern.test(text)) {
      signals.push({
        id: signal.id,
        weight: signal.weight,
        explanation: signal.explanation,
        category: signal.category,
      });
    }
  }

  // Suspicious links inside the message contribute their own URL score.
  let strongestUrlScore = 0;
  for (const raw of text.match(URL_PATTERN) ?? []) {
    const url = analyzeUrl(raw);
    strongestUrlScore = Math.max(strongestUrlScore, url.score);
    if (url.score >= 50) {
      signals.push({
        id: "suspicious-link",
        weight: 20,
        explanation: `Suspicious link inside the message: ${raw}`,
        category: "pressure",
      });
    } else if (url.score >= 25) {
      signals.push({
        id: "risky-link",
        weight: 10,
        explanation: `Risky-looking link inside the message: ${raw}`,
        category: "pressure",
      });
    }
  }

  // Structural check: scam SMSes are unusually dense in digits/symbols.
  const digitRatio = (text.replace(/[^\d]/g, "").length / Math.max(text.length, 1));
  if (digitRatio > 0.3) {
    signals.push({
      id: "digit-heavy",
      weight: 6,
      explanation: "Message is unusually dense in digits and symbols.",
      category: "style",
    });
  }

  // A message containing a badly-scored URL can never look "safe" overall:
  // the final score is at least as high as its most dangerous link.
  const textScore = signals.reduce((sum, s) => sum + s.weight, 0);
  const score = Math.min(100, Math.max(textScore, strongestUrlScore));
  return { score, level: levelForScore(score), signals };
}

// ---------------------------------------------------------------------------
// URL forensics
// ---------------------------------------------------------------------------

const SHORTENER_DOMAINS = [
  "bit.ly", "tinyurl.com", "t.co", "is.gd", "buff.ly", "ow.ly",
  "cutt.ly", "rb.gy", "shorturl.at",
] as const;

const SUSPICIOUS_TLDS = [".xyz", ".click", ".link", ".top", ".live", ".info", ".online", ".site", ".tk", ".cn", ".ru"] as const;

const BAIT_KEYWORDS = [
  "sbi", "hdfc", "icici", "axis", "kotak", "paytm", "phonepe", "gpay",
  "rbi", "kyc", "secure", "login", "verify", "update", "wallet", "bank",
] as const;

/** The checks that make up a URL's risk profile. Each returns points to add. */
export function analyzeUrl(input: string): Analysis {
  const raw = input.trim();
  if (!raw) return { score: 0, level: "safe", signals: [] };

  const signals: ScoredSignal[] = [];
  const add = (id: string, weight: number, explanation: string) =>
    signals.push({ id, weight, explanation, category: "impersonation" });

  const candidate = /^https?:\/\//i.test(raw) ? raw : `http://${raw}`;

  let url: URL;
  try {
    url = new URL(candidate);
  } catch {
    return {
      score: 80,
      level: "dangerous",
      signals: [
        {
          id: "malformed-url",
          weight: 80,
          explanation: "Not a valid URL — a common sign of a crafted phishing link.",
          category: "pressure",
        },
      ],
    };
  }

  const host = url.hostname.toLowerCase();
  const path = (url.pathname + url.search).toLowerCase();

  if (url.protocol !== "https:") {
    add("no-https", 10, "Uses insecure HTTP instead of HTTPS.");
  }

  if (SHORTENER_DOMAINS.some((d) => host.endsWith(d))) {
    add("url-shortener", 35, `URL shortener (${host}) hides the real destination.`);
  }

  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) {
    add("raw-ip", 30, "Uses a raw IP address instead of a domain.");
  }

  if (host.split(".").length - 1 >= 4) {
    add("deep-subdomains", 15, "Excessive subdomains — common in phishing.");
  }

  if (/[^a-z0-9.-]/i.test(host)) {
    add("homograph-host", 25, "Hostname contains unusual characters (possible lookalike domain).");
  }

  for (const tld of SUSPICIOUS_TLDS) {
    if (host.endsWith(tld)) {
      add("risky-tld", 18, `Uses a frequently-abused top-level domain (${tld}).`);
      break;
    }
  }

  const baitHits = BAIT_KEYWORDS.filter((b) => host.includes(b) || path.includes(b));
  if (baitHits.length > 0) {
    add("bait-keywords", 15, `Contains banking/identity bait words: ${baitHits.join(", ")}.`);
  }

  if ((host.match(/\d/g) ?? []).length >= 4) {
    add("digit-stuffed-host", 10, "Hostname contains many digits.");
  }

  if ((host.match(/-/g) ?? []).length >= 3) {
    add("hyphen-heavy-host", 8, "Hostname contains excessive hyphens.");
  }

  if (host.length > 30) {
    add("long-host", 8, "Unusually long hostname.");
  }

  if (path.length > 60) {
    add("long-path", 6, "Very long URL path or query string.");
  }

  const score = Math.min(100, signals.reduce((sum, s) => sum + s.weight, 0));
  return { score, level: levelForScore(score), signals };
}
