# AI Prompts — SpendSense AI

## Claude AI Summary (AuditResults page)

Used in `src/lib/api.ts → generateSummary()`.

Model: `claude-sonnet-4-20250514`

```
You are a concise financial advisor for AI tool spend at startups.

Write a 90-110 word summary paragraph for this founder. Be direct and specific.
Use exact dollar figures. No bullet points. No headers. Write in second person.
End with one clear action they should take first.

Team size: {teamSizeLabel}
Primary use case: {useCase}
Total monthly spend: ${totalCurrentSpend}
Total potential savings: ${totalSavings}/mo (${annualSavings}/year)
Tool breakdown: {toolBreakdown}
```

### Fallback (no API key)

A static template string is used when `VITE_ANTHROPIC_API_KEY` is not set:

> "Your team is spending ${totalCurrentSpend}/month across {toolCount} AI tools.
> Based on your {useCase} use case and team of {teamSize}, we found ${totalSavings}/month
> in potential savings (${annualSavings}/year). The biggest opportunity: {topAction}..."

---

## Resend confirmation email

Used in `src/lib/email.ts → sendConfirmationEmail()`.

Subject: `Your AI audit — ${totalSavings}/month in savings found`

Content: Full branded HTML email with:
- Green savings hero block (monthly + annual figure)
- Per-tool action table (overspending / can optimize rows only)
- "View full audit →" CTA button linking to `${siteOrigin}/audit/${auditId}`
- Privacy footer (no spam, shared links never reveal email)

### CORS note

Resend blocks direct browser → API calls. Move `sendConfirmationEmail` behind a
server-side route (`POST /api/send-email`) that reads `RESEND_API_KEY` from `process.env`
(not a `VITE_` variable) before deploying to production.
