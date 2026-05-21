# Reflection

## 1. Hardest bug

[Write about a real bug you hit. Be specific — what line of code, 
what hypothesis, what you tried. Example structure:]

The hardest bug was in the audit engine's seat calculation. When a 
user entered 0 seats for a tool they'd disabled, the savings calculation 
returned NaN, which then cascaded into the totals showing "NaN/month" 
on the results page.

My first hypothesis was a type coercion issue — the form was returning 
the seat field as a string "0" and I was doing arithmetic on it directly. 
I added `Number()` conversion everywhere, but the bug persisted.

Second hypothesis: the engine was running before the form values had 
settled in localStorage. I added console.logs at every step and found 
the engine was actually receiving `undefined` for disabled tools, not 0. 
The fix was adding a guard: `const seats = tool.enabled ? tool.seats : 0` 
before any calculation. Three-line fix after two hours of debugging.

## 2. A decision I reversed

[Real example of changing your mind mid-week]

I originally planned to call the Anthropic API on every form submission, 
streaming the summary in real time. By Day 3 I reversed this — the 
streaming UX added complexity and the latency made the results page 
feel slow. I switched to a single POST after the audit loads, with a 
skeleton loader while the summary generates. The UX is cleaner and the 
fallback is easier to implement.

## 3. What I'd build in week 2

- Benchmark mode: "your AI spend per developer is $X — teams your 
  size average $Y" with real percentile data
- A Slack bot that runs the audit on your team's bill automatically
- PDF export so founders can share the report in board decks
- Saved audit history so you can track spend changes over time
- An embeddable widget for AI tool review sites

## 4. How I used AI tools

Used Claude (Sonnet) extensively throughout:
- **Scaffolding:** Generated the initial TypeScript types for the 
  audit engine schema. Saved ~1 hour.
- **Debugging:** Pasted error traces and got accurate diagnoses ~70% 
  of the time. For the NaN bug above, Claude suggested the wrong fix 
  first (type coercion) before I found the real issue.
- **Copy:** Drafted landing page headlines — I rewrote most of them 
  because they were too generic.
- **Did NOT trust it with:** Pricing data. Claude's training cutoff 
  means it had wrong prices for Cursor Business ($40, not $20 as it 
  suggested). I verified every number against official pricing pages.
- **Caught wrong:** Claude told me Windsurf's Pro plan was $10/month. 
  The actual price is $15/month. Always verify pricing independently.

## 5. Self-ratings

| Dimension | Rating | Reason |
|---|---|---|
| Discipline | 7/10 | Committed every day, but Day 5 was thin — got stuck on Supabase auth |
| Code quality | 7/10 | Types are solid, audit engine is clean, but some components got messy |
| Design sense | 8/10 | Results page looks genuinely good — savings hero is satisfying |
| Problem-solving | 8/10 | Debugging the audit engine taught me to add guards earlier |
| Entrepreneurial thinking | 7/10 | GTM and economics sections stretched me — I'm a developer first |