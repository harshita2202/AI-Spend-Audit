# Pricing Data — SpendSense AI

Last verified: 2025-05-23

All plan prices are hardcoded in `src/lib/auditEngine.ts` with inline
`// PRICING SOURCE: verified YYYY-MM-DD` comments. Update these when vendors
change their pricing.

## Tools covered

| Tool | Plans | Last verified |
|---|---|---|
| Cursor | Hobby $0 · Pro $20/seat · Business $40/seat · Enterprise custom | 2025-05-21 |
| GitHub Copilot | Individual $10 · Business $19 · Enterprise $39 | 2025-05-21 |
| Windsurf | Free $0 · Pro $15 · Teams $35 · Enterprise custom | 2025-05-21 |
| Replit | Free $0 · Core $25 · Teams $40 · Enterprise custom | 2025-05-21 |
| Tabnine | Basic $4 · Pro $12 · Enterprise custom | 2025-05-21 |
| Amazon Q Developer | Free $0 · Pro $19 | 2025-05-21 |
| Bolt.new | Free $0 · Pro $20 · Teams $25 | 2025-05-21 |
| Claude (Anthropic) | Free $0 · Pro $20 · Max $100/$200 · Team $25 · Enterprise custom | 2025-05-21 |
| ChatGPT (OpenAI) | Free $0 · Plus $20 · Pro $200 · Team $25 · Enterprise custom | 2025-05-21 |
| Gemini (Google) | Free $0 · Advanced $19.99 · Business $24 · Enterprise $30 | 2025-05-21 |
| Grok (xAI) | X Premium $8 · X Premium+ $16 · SuperGrok $30 | 2025-05-21 |
| Perplexity AI | Free $0 · Pro $20 · Enterprise $40 | 2025-05-21 |
| Mistral AI | Le Chat Free $0 · Le Chat Pro $14.99 | 2025-05-21 |
| Notion AI | Free (limited) · AI Add-on $8 · Enterprise AI custom | 2025-05-21 |
| Midjourney | Basic $10 · Standard $30 · Pro $60 · Mega $120 | 2025-05-21 |
| Runway | Standard $12 · Pro $28 · Unlimited $76 · Enterprise custom | 2025-05-21 |
| ElevenLabs | Free $0 · Starter $5 · Creator $22 · Pro $99 · Scale $330 | 2025-05-21 |
| Anthropic API Direct | Usage-based | — |
| OpenAI API Direct | Usage-based | — |
| Cohere | Trial $0 · Production usage-based · Enterprise custom | 2025-05-21 |
| Together AI | Usage-based | — |
| Devin (Cognition) | Teams $500 · Enterprise custom | 2025-05-21 |

## Audit rules implemented

Rules live in `src/lib/auditEngine.ts`. Each tool has a dedicated function:

- **Cursor**: flags excess seats on Pro/Business vs team size; flags Business plan for non-coding teams
- **GitHub Copilot**: flags Enterprise < 20 seats; flags Business ≤ 3 seats; flags Business for writing/research teams
- **Claude**: flags Max for non-research/data teams; flags Team plan < 5 seats; suggests Team upgrade at scale
- **ChatGPT**: flags seat count > team size; flags Team plan ≤ 2 seats; suggests Team upgrade at scale
- **Windsurf**: flags Teams plan < 4 seats; flags Pro for non-coding teams
- **Gemini**: flags Ultra/AI Premium for non-data/research teams
- **API Direct tools**: suggests Credex consultation at $500+/mo; suggests usage audit at $200+/mo

## How to update pricing

1. Edit the relevant `auditXxx()` function in `src/lib/auditEngine.ts`
2. Update the `TOOLS` array in `src/lib/mockData.ts` (plans list and `pricePerSeat`)
3. Update the table in this file with the new price and verification date
4. Run tests: `pnpm --filter @workspace/spendsense run test` — update expected savings figures
