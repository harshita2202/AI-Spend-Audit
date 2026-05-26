# Devlog

## Day 1 — 2026-05-21
**Hours worked:** 4
**What I did:** Set up repo, Vite + React + TypeScript scaffold, 
installed Tailwind and shadcn/ui. Built the landing page hero and 
navigation. Deployed a blank shell to Vercel to confirm CI works.
**What I learned:** shadcn/ui's CLI doesn't work well with Vite's 
path aliases out of the box — had to manually configure tsconfig paths.
**Blockers / what I'm stuck on:** Unsure whether to use React Router 
or Next.js App Router. Leaning React Router to keep it simple.
**Plan for tomorrow:** Build the multi-step spend input form with 
localStorage persistence.

## Day 2 — 2026-05-22
**Hours worked:** 5
**What I did:** Built entire spend input form — 8 tool cards, 
plan dropdowns, seat inputs, localStorage hook. Form persists on reload.
**What I learned:** Controlled inputs with React Hook Form + Zod 
are much cleaner than useState soup. Validation errors surface naturally.
**Blockers / what I'm stuck on:** Deciding how to structure the 
audit engine — flat rules vs a scoring system.
**Plan for tomorrow:** Build audit engine and results page UI.

## Day 3 — 2026-05-23
**Hours worked:** 6
**What I did:** Built the real audit engine (auditEngine.ts) with 
rule-based pricing logic for 8 tools — Cursor, GitHub Copilot, Claude, 
ChatGPT, Windsurf, Gemini, Anthropic API, OpenAI API. Wired Supabase 
backend — created schema.sql, set up audits and leads tables with RLS 
policies. Built api.ts with saveAudit, getPublicAudit, saveLead, and 
generateSummary functions. Integrated Anthropic API for the AI summary 
with a fallback template for when the key is missing. Wired AuditForm 
to the real engine — form submit now calculates real savings, saves to 
Supabase, and navigates to /results/:uuid. Added sessionStorage caching 
so results load instantly after form submit. Set up CI with GitHub 
Actions and vercel.json for SPA routing.
**What I learned:** Resend cannot be called directly from the browser 
due to CORS — had to move email sending server-side. Also learned that 
sessionStorage is much better than passing state through React Router 
for the form → results handoff.
**Blockers / what I'm stuck on:** Anthropic API CORS headers require 
the anthropic-dangerous-direct-browser-access header — took time to 
find this in the docs.
**Plan for tomorrow:** Results page polish, benchmark mode, PDF export, 
and all remaining markdown files.

## Day 4 — 2026-05-24
**Hours worked:** 6
**What I did:** Added PDF export using jspdf and html2canvas — button 
on results page downloads a full audit report. Built BenchmarkCard 
component showing spend-per-developer vs industry average with a visual 
spectrum bar. Wired AuditResults to real Supabase data with proper 
loading and not-found states. Added SharedAudit page with Open Graph 
meta tags for Twitter and LinkedIn previews. Fixed mobile responsiveness 
across all pages — form, results, and landing now work at 375px. Added 
Lighthouse accessibility fixes: skip nav link, aria-labels on icon 
buttons, labels on all inputs, role=progressbar on the form stepper. 
Wrote ARCHITECTURE.md, GTM.md, ECONOMICS.md, LANDING_COPY.md, 
METRICS.md, PRICING_DATA.md, PROMPTS.md, TESTS.md, README.md.
**What I learned:** html2canvas needs scale:2 for retina-quality PDF 
output — default scale produces blurry exports. BenchmarkCard data 
needs to be clearly labelled as estimates or it feels misleading.
**Blockers / what I'm stuck on:** NaN values in savings totals when 
a tool is toggled on but seats field left empty — fixed with 
Number(val) || 0 guards throughout the engine.
**Plan for tomorrow:** Accessibility polish, 10 tests passing, 
REFLECTION.md, USER_INTERVIEWS.md, final submission prep.

## Day 5 — 2026-05-25
**Hours worked:** 3
**What I did:** Fixed UI bugs, improved responsiveness, cleaned up styling 
issues, and deployed the final version to Vercel.
**What I learned:** Deployment testing helps catch issues that don't appear locally.
**Blockers / what I'm stuck on:** Some features needed extra setup after deployment.
**Plan for tomorrow:** Final submission.