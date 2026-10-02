import { describe, expect, it } from "vitest";
import { analyzeSms, analyzeUrl, levelForScore } from "./detection";

describe("levelForScore", () => {
  it("applies the documented thresholds", () => {
    expect(levelForScore(0)).toBe("safe");
    expect(levelForScore(24)).toBe("safe");
    expect(levelForScore(25)).toBe("suspicious");
    expect(levelForScore(59)).toBe("suspicious");
    expect(levelForScore(60)).toBe("dangerous");
    expect(levelForScore(100)).toBe("dangerous");
  });
});

describe("analyzeSms", () => {
  it("scores an empty message as safe with no signals", () => {
    const result = analyzeSms("");
    expect(result.level).toBe("safe");
    expect(result.score).toBe(0);
    expect(result.signals).toHaveLength(0);
  });

  it("lets an ordinary message pass with zero signals", () => {
    const result = analyzeSms("Hey! Want to grab coffee at 5pm tomorrow?");
    expect(result.level).toBe("safe");
    expect(result.score).toBe(0);
    expect(result.signals).toHaveLength(0);
  });

  it("flags a KYC extortion message as dangerous", () => {
    const result = analyzeSms(
      "Dear customer, your KYC is expiring today. Verify immediately at http://sbi-kyc.click/x9 or your account will be blocked.",
    );
    expect(result.level).toBe("dangerous");
    expect(result.score).toBeGreaterThanOrEqual(60);
    const ids = result.signals.map((s) => s.id);
    expect(ids).toContain("identity-verification");
    expect(ids).toContain("account-threat");
    expect(ids).toContain("risky-link");
  });

  it("flags credential requests (OTP/CVV) as dangerous", () => {
    const result = analyzeSms(
      "Bank alert: your account will be blocked. Share OTP 482911 and CVV immediately to avoid suspension.",
    );
    expect(result.level).toBe("dangerous");
    const ids = result.signals.map((s) => s.id);
    expect(ids).toContain("asks-otp");
    expect(ids).toContain("asks-card-secret");
  });

  it("caps the score at 100 even when many signals match", () => {
    const result = analyzeSms(
      "URGENT: VERIFY your KYC now, share OTP and CVV and PIN, your account will be BLOCKED, click here, you won the lottery, call +91 9876543210, parcel delivery failed, instant loan approved, part time job offer, SBI",
    );
    expect(result.score).toBe(100);
    expect(result.level).toBe("dangerous");
  });

  it("escalates to suspicious when the message is mostly a risky link", () => {
    const result = analyzeSms("visit http://sbi-kyc.click/x9 now");
    expect(result.score).toBeGreaterThanOrEqual(25);
    expect(result.level).not.toBe("safe");
  });
});

describe("analyzeUrl", () => {
  it("accepts a normal https site as safe", () => {
    const result = analyzeUrl("https://www.google.com");
    expect(result.level).toBe("safe");
    expect(result.score).toBe(0);
    expect(result.signals).toHaveLength(0);
  });

  it("flags a bare URL shortener as dangerous", () => {
    const result = analyzeUrl("bit.ly/3xZk-bank-secure");
    expect(result.level).toBe("dangerous");
    const ids = result.signals.map((s) => s.id);
    expect(ids).toContain("url-shortener");
    expect(ids).toContain("no-https");
  });

  it("flags a risky TLD stuffed with banking bait", () => {
    const result = analyzeUrl("http://sbi-kyc.click/verify-account");
    expect(result.score).toBeGreaterThanOrEqual(25);
    const ids = result.signals.map((s) => s.id);
    expect(ids).toContain("risky-tld");
    expect(ids).toContain("bait-keywords");
  });

  it("flags raw IP addresses", () => {
    const result = analyzeUrl("http://192.168.0.1/login");
    const ids = result.signals.map((s) => s.id);
    expect(ids).toContain("raw-ip");
    expect(result.level).not.toBe("safe");
  });

  it("rejects malformed URLs as dangerous", () => {
    const result = analyzeUrl("not a url at all");
    expect(result.level).toBe("dangerous");
    expect(result.signals.map((s) => s.id)).toContain("malformed-url");
  });
});
