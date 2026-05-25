# StackLens — Free AI Spend Audit for Startups

StackLens helps startup founders and engineering managers find out 
if they're overpaying for AI tools. Input your stack, get an instant 
breakdown of savings opportunities, and share your audit via a unique URL.

**Live demo:** https://your-deployed-url.vercel.app

---

## Screenshots

[Insert 3 screenshots here — landing page, form, results page]
Or: [30-second Loom walkthrough](https://loom.com/your-link)

---

## Quick start

```bash
git clone https://github.com/yourusername/stacklens
cd frontend
pnpm install
pnpm dev
```

To deploy:
```bash
pnpm run build

```

---

## Decisions

1. **React + Vite over Next.js** — No SSR needed for an SPA audit tool. 
   Vite's build speed made iteration faster during the 7-day window.

2. **Rule-based audit engine, not AI** — Pricing comparisons are 
   deterministic. Using LLMs for math introduces hallucination risk. 
   AI is used only for the narrative summary where creativity adds value.

3. **Supabase over Firebase** — Postgres gives us proper relational 
   queries for future analytics. Firebase's document model would have 
   made aggregating audit data across users harder.

4. **Email gate after results, not before** — Showing value first 
   increases conversion. Gating before results kills top-of-funnel 
   trust, especially for a cold visitor from Hacker News.

5. **Unique shareable UUID per audit** — Enables viral loop without 
   requiring accounts. Stripping PII from the public URL means users 
   share freely without privacy concerns.