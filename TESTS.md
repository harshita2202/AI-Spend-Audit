# Tests

Run all tests: `npm test`

## Audit engine tests (src/__tests__/auditEngine.test.ts)

| # | Test | What it covers |
|---|------|---------------|
| 1 | Cursor seat reduction | Oversized Business team gets downsizing recommendation |
| 2 | Copilot Individual recommendation | Small Business team should switch to cheaper plan |
| 3 | Claude Max to Pro | Non-research teams do not need Max plan |
| 4 | ChatGPT excess seats | Seats above team size triggers reduction |
| 5 | Zero savings case | Optimal setup returns 0 savings, no Credex CTA |
| 6 | Credex CTA threshold | Savings above $500/mo triggers showCredexCTA true |
| 7 | Disabled tool handling | Disabled tools excluded, no NaN in totals |
| 8 | Windsurf Teams vs Pro | Small team on Teams plan recommended to downgrade |
| 9 | Annual savings calculation | Annual is exactly 12x monthly with no rounding error |
| 10 | Multi-tool savings sum | Total savings equals sum of all individual tool savings |

All 10 tests pass. Run with: `npm test`