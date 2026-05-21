# Metrics

## North Star metric

**Audits completed per week**

Why: An audit completed means a user trusted us enough to input 
their real spend data. It's the moment of core value delivery — 
everything else (email capture, Credex CTA, share URL) is 
downstream of this event. DAU is wrong for a tool people use 
quarterly. "Emails captured" is too far downstream and penalizes 
honest "you're spending well" results.

## Three input metrics that drive it

1. **Visitor → audit start rate** — measures landing page 
   and headline quality. Target: >25%. Below 15% = rewrite the 
   hero copy or reduce form friction.

2. **Audit start → completion rate** — measures form UX. 
   Target: >65%. Below 50% = the form has a dropout point, 
   run session recordings to find it.

3. **Referral share rate** — % of results viewers who click 
   "share my audit." Measures viral coefficient. Target: >15%. 
   This drives compounding growth without paid spend.

## What to instrument first

1. Page view → "Start audit" click (conversion)
2. Step 1 complete, Step 2 complete, Step 3 submit (form funnel)
3. Results page view (core event)
4. Email capture submit
5. Share button click
6. Credex CTA click (most valuable downstream event)

Use PostHog (free tier) — it gives funnels, session recordings, 
and feature flags in one tool.

## Pivot trigger

If after 200 audits completed, the Credex CTA click-through 
rate is below 2%, the tool is not qualifying leads effectively. 
This means either: (a) the wrong audience is using it — teams 
already spending optimally, or (b) the Credex value prop isn't 
landing. At that threshold, run 5 user interviews to find out 
which before changing the product.