# Tests — SpendSense AI

## Run

```bash
# One-shot (CI)
PORT=3000 BASE_PATH=/ pnpm --filter @workspace/spendsense run test

# Watch mode (dev)
PORT=3000 BASE_PATH=/ pnpm --filter @workspace/spendsense run test:watch
```

## Coverage

All 13 tests are in `src/__tests__/auditEngine.test.ts` and cover `runAuditEngine()` — the pure sync audit rule engine.

| Suite | Test | What it validates |
|---|---|---|
| Cursor | Business ×10 seats, team of 3 | `overspending`, seat reduction action, saving > 0 |
| GitHub Copilot | Business ×2 seats | `overspending`, downgrade to Individual, saving = $18 |
| GitHub Copilot | Enterprise ×10 seats | `overspending`, downgrade to Business, saving = $200 |
| Claude | Max plan, useCase=Coding | `overspending`, downgrade to Pro, saving = $240 |
| Claude | Max plan, useCase=Research | `optimal`, saving = 0 (Max is justified for research) |
| Claude | Team ×3 seats | `overspending`, min-5-seats rule, saving = $15 |
| ChatGPT | Team ×12, teamSize=6-15 | `overspending`, remove 2 excess seats, saving = $50 |
| ChatGPT | Team ×2 seats | `overspending`, switch to Plus, saving = $10 |
| All optimal | Coding team, 3 tools | `totalSavings = 0`, `showCredexCTA = false` |
| showCredexCTA | Large savings scenario | `showCredexCTA = true` when savings > $500 |
| Disabled tools | 1 disabled + 1 enabled | disabled tool absent from recs, correct spend total |
| Windsurf | Teams ×2 seats | `overspending`, switch to Pro, saving = $40 |
| Totals | 2 enabled + 1 disabled | `totalCurrentSpend` = sum of enabled, `annualSavings = totalSavings × 12` |

## Adding tests

Add new test cases in `src/__tests__/auditEngine.test.ts`. Use the `baseForm()` helper to create
a minimal `AuditFormData` and override only what you need. Always test:

1. The `status` field (`"overspending"` | `"optimize"` | `"optimal"`)
2. The `potentialSaving` amount (exact dollar value when deterministic)
3. The `action` string (regex match for key words)
