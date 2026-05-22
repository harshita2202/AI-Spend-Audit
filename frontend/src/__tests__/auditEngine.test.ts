import { describe, it, expect } from "vitest";
import { runAuditEngine } from "../lib/auditEngine";
import type { AuditFormData } from "../lib/types";

function baseForm(overrides: Partial<AuditFormData> = {}): AuditFormData {
  return {
    teamSize: "6-15",
    useCase: "Mixed",
    tools: {},
    ...overrides,
  };
}

// ── 1. Cursor Business ×10, team of 3 (2-5), useCase=Mixed → seat reduction ──
describe("Cursor", () => {
  it("Business ×10 seats, team of 3, Mixed → recommends seat reduction", () => {
    const result = runAuditEngine(
      baseForm({
        teamSize: "2-5", // → 3
        useCase: "Mixed",
        tools: {
          cursor: { enabled: true, planLabel: "Business", seats: 10, monthlySpend: 400 },
        },
      })
    );
    const rec = result.recommendations.find((r) => r.toolId === "cursor");
    expect(rec).toBeDefined();
    expect(rec!.status).toBe("overspending");
    expect(rec!.potentialSaving).toBeGreaterThan(0);
    expect(rec!.action).toMatch(/seat|reduce/i);
  });
});

// ── 2. GitHub Copilot Business ×2 seats → recommends Individual plan ─────────
describe("GitHub Copilot", () => {
  it("Business ×2 seats → recommends Individual plan", () => {
    const result = runAuditEngine(
      baseForm({
        tools: {
          "github-copilot": { enabled: true, planLabel: "Business", seats: 2, monthlySpend: 38 },
        },
      })
    );
    const rec = result.recommendations.find((r) => r.toolId === "github-copilot");
    expect(rec).toBeDefined();
    expect(rec!.status).toBe("overspending");
    expect(rec!.potentialSaving).toBe(18); // 2 × $9
  });

  it("Enterprise ×10 seats → recommends Business plan", () => {
    const result = runAuditEngine(
      baseForm({
        tools: {
          "github-copilot": { enabled: true, planLabel: "Enterprise", seats: 10, monthlySpend: 390 },
        },
      })
    );
    const rec = result.recommendations.find((r) => r.toolId === "github-copilot");
    expect(rec!.status).toBe("overspending");
    expect(rec!.potentialSaving).toBe(200); // 10 × $20
  });
});

// ── 3. Claude Max, useCase=Coding → recommends Pro ───────────────────────────
describe("Claude", () => {
  it("Max plan, useCase=Coding → recommends Pro plan", () => {
    const result = runAuditEngine(
      baseForm({
        useCase: "Coding",
        tools: {
          claude: { enabled: true, planLabel: "Max ($100)", seats: 3, monthlySpend: 300 },
        },
      })
    );
    const rec = result.recommendations.find((r) => r.toolId === "claude");
    expect(rec).toBeDefined();
    expect(rec!.status).toBe("overspending");
    expect(rec!.potentialSaving).toBe(240); // 3 × $80
  });

  it("Max plan, useCase=Research → stays optimal (Max is justified)", () => {
    const result = runAuditEngine(
      baseForm({
        useCase: "Research",
        tools: {
          claude: { enabled: true, planLabel: "Max ($100)", seats: 2, monthlySpend: 200 },
        },
      })
    );
    const rec = result.recommendations.find((r) => r.toolId === "claude");
    expect(rec!.status).toBe("optimal");
    expect(rec!.potentialSaving).toBe(0);
  });

  it("Team plan ×3 seats → recommends Pro (min 5 seats)", () => {
    const result = runAuditEngine(
      baseForm({
        tools: {
          claude: { enabled: true, planLabel: "Team", seats: 3, monthlySpend: 75 },
        },
      })
    );
    const rec = result.recommendations.find((r) => r.toolId === "claude");
    expect(rec!.status).toBe("overspending");
    expect(rec!.potentialSaving).toBe(15); // 3 × $5
  });
});

// ── 4. ChatGPT Team with more seats than team size → recommends reduction ─────
describe("ChatGPT", () => {
  it("Team ×12 seats, teamSize=6-15 (→10) → recommends removing 2 excess seats", () => {
    const result = runAuditEngine(
      baseForm({
        teamSize: "6-15", // → 10
        tools: {
          chatgpt: { enabled: true, planLabel: "Team", seats: 12, monthlySpend: 300 },
        },
      })
    );
    const rec = result.recommendations.find((r) => r.toolId === "chatgpt");
    expect(rec).toBeDefined();
    expect(rec!.status).toBe("overspending");
    expect(rec!.potentialSaving).toBe(50); // (12-10) × $25
  });

  it("Team ×2 seats → recommends Plus plan", () => {
    const result = runAuditEngine(
      baseForm({
        teamSize: "2-5",
        tools: {
          chatgpt: { enabled: true, planLabel: "Team", seats: 2, monthlySpend: 50 },
        },
      })
    );
    const rec = result.recommendations.find((r) => r.toolId === "chatgpt");
    expect(rec!.status).toBe("overspending");
    expect(rec!.potentialSaving).toBe(10); // 2 × $5
  });
});

// ── 5. All tools optimal → totalSavings = 0, showCredexCTA = false ────────────
describe("All optimal", () => {
  it("Well-calibrated tools → totalSavings = 0, showCredexCTA = false", () => {
    const result = runAuditEngine(
      baseForm({
        teamSize: "6-15",
        useCase: "Coding",
        tools: {
          cursor: { enabled: true, planLabel: "Pro", seats: 5, monthlySpend: 100 },
          "github-copilot": { enabled: true, planLabel: "Business", seats: 5, monthlySpend: 95 },
          claude: { enabled: true, planLabel: "Pro", seats: 3, monthlySpend: 60 },
        },
      })
    );
    expect(result.totalSavings).toBe(0);
    expect(result.showCredexCTA).toBe(false);
    result.recommendations.forEach((r) => {
      expect(r.status).toBe("optimal");
      expect(r.potentialSaving).toBe(0);
    });
  });
});

// ── 6. totalSavings > 500 → showCredexCTA = true ─────────────────────────────
describe("showCredexCTA", () => {
  it("Large savings → showCredexCTA = true", () => {
    // Cursor Business ×20 seats, team=2-5 → huge seat reduction
    const result = runAuditEngine(
      baseForm({
        teamSize: "2-5", // → 3
        useCase: "Mixed",
        tools: {
          cursor: { enabled: true, planLabel: "Business", seats: 20, monthlySpend: 800 },
          chatgpt: { enabled: true, planLabel: "Team", seats: 20, monthlySpend: 500 }, // excess seats
        },
      })
    );
    expect(result.totalSavings).toBeGreaterThan(500);
    expect(result.showCredexCTA).toBe(true);
  });
});

// ── 7. Disabled tool → excluded from results, no NaN in totals ───────────────
describe("Disabled tools", () => {
  it("Disabled tool is excluded from recommendations and totals", () => {
    const result = runAuditEngine(
      baseForm({
        tools: {
          cursor: { enabled: false, planLabel: "Business", seats: 10, monthlySpend: 400 },
          claude: { enabled: true, planLabel: "Pro", seats: 2, monthlySpend: 40 },
        },
      })
    );
    const cursorRec = result.recommendations.find((r) => r.toolId === "cursor");
    expect(cursorRec).toBeUndefined();
    expect(result.totalCurrentSpend).toBe(40); // only claude
    expect(Number.isNaN(result.totalCurrentSpend)).toBe(false);
    expect(Number.isNaN(result.totalSavings)).toBe(false);
    expect(Number.isNaN(result.annualSavings)).toBe(false);
  });
});

// ── 8. Windsurf Teams <4 seats → recommends Pro ───────────────────────────────
describe("Windsurf", () => {
  it("Teams ×2 seats → recommends Pro plan", () => {
    const result = runAuditEngine(
      baseForm({
        tools: {
          windsurf: { enabled: true, planLabel: "Teams", seats: 2, monthlySpend: 70 },
        },
      })
    );
    const rec = result.recommendations.find((r) => r.toolId === "windsurf");
    expect(rec!.status).toBe("overspending");
    expect(rec!.potentialSaving).toBe(40); // 2 × $20
  });
});

// ── 9. Totals are correct sum ─────────────────────────────────────────────────
describe("Totals", () => {
  it("totalCurrentSpend = sum of enabled tool spends", () => {
    const result = runAuditEngine(
      baseForm({
        tools: {
          cursor: { enabled: true, planLabel: "Pro", seats: 3, monthlySpend: 60 },
          claude: { enabled: true, planLabel: "Pro", seats: 2, monthlySpend: 40 },
          chatgpt: { enabled: false, planLabel: "Team", seats: 5, monthlySpend: 125 },
        },
      })
    );
    expect(result.totalCurrentSpend).toBe(100); // 60 + 40
    expect(result.annualSavings).toBe(result.totalSavings * 12);
  });
});
