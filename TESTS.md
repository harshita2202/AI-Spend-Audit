# Tests

All tests use Vitest. Run with: `npm run test`

## Audit engine tests

| File | What it covers | Command |
|------|---------------|---------|
| `src/__tests__/auditEngine.test.ts` | Core savings calculation | `npm test` |

### Test list

1. **`calculates correct savings for oversized Cursor team`**  
   Input: Cursor Business × 10 seats at $400/mo, team of 3 developers.  
   Expected: recommends downgrade to Pro × 3, savings = $270/mo.

2. **`returns zero savings for already-optimal plan`**  
   Input: GitHub Copilot Individual × 1 seat at $10/mo, solo developer.  
   Expected: `savingsAmount = 0`, `recommendation = "optimal"`.

3. **`handles disabled tools gracefully`**  
   Input: Tool with `enabled: false`.  
   Expected: tool excluded from audit, no NaN in totals.

4. **`calculates annual savings correctly`**  
   Input: monthly savings of $150.  
   Expected: annual savings = $1800 exactly.

5. **`surfaces Credex CTA only above $500/mo threshold`**  
   Input: audit with $600/mo savings.  
   Expected: `showCredexCTA = true`.  
   Input: audit with $400/mo savings.  
   Expected: `showCredexCTA = false`.

6. **`seat count validation rejects negative seats`**  
   Input: seats = -1.  
   Expected: Zod validation error, form does not submit.

7. **`audit total matches sum of per-tool savings`**  
   Input: 3 tools with individual savings of $50, $80, $120.  
   Expected: total savings = $250.