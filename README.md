# 🛡️ SmishShield

**Your SMS Defense — spot smishing scams before they cost you.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-smishshield-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://smishshield.vercel.app)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Tests](https://img.shields.io/badge/tests-12%20passing-brightgreen?style=for-the-badge)](#-testing)

SmishShield analyzes suspicious SMS messages and links **entirely in your browser** — nothing ever leaves your device — and explains exactly why a message is risky.

## 🌐 Live Demo

**➡️ [Try SmishShield live](https://smishshield.vercel.app)**

## ✨ Features

- 🤖 **SMS Detector** — paste any message, get a 0–100 risk score with plain-English reasons
- 🔗 **Link Scanner** — URL forensics: shorteners, lookalike domains, risky TLDs, banking bait
- 🧠 **Transparent scoring** — every red flag is shown with its weight; no black box
- 🔒 **100% private** — all analysis runs client-side

## 🧠 How scoring works

Each red-flag signal carries a weight (credential requests score highest):

| Signal | Weight |
| :--- | ---: |
| Asks for CVV / PIN / password | 22 |
| Mentions OTP | 18 |
| KYC / Aadhaar verification bait | 18 |
| Prize / lottery bait | 16 |
| Artificial urgency | 15 |
| "Click here" pressure | 14 |

```
score ≥ 60 → ☠️ DANGEROUS    score ≥ 25 → ⚠️ SUSPICIOUS    score < 25 → ✅ SAFE
```

## 🛠️ Tech stack

- **React 19** + **TypeScript** (strict mode)
- **Vite 7** — build tool
- **Tailwind CSS 4** — styling
- **Vitest 5** — unit tests
- **Vercel** — hosting

## 📦 Commands

| Command | Description |
| :--- | :--- |
| `bun run dev` | Start dev server |
| `bun run build` | Type-check + production build |
| `bun run test` | Run the test suite |

## 🧪 Testing

The detection engine ships with unit tests covering thresholds, real scam samples, score capping and malformed URLs:

```bash
bun run test
```

---

Made with ❤️ by **[Ankitha RH](https://github.com/Ankikithaaa28)**
