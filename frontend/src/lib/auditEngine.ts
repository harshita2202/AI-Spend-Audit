// PRICING SOURCE: verified 2025-05-21
import type { AuditFormData, AuditResult, ToolRecommendation, UseCase } from "./types";

// ── Helpers ──────────────────────────────────────────────────────────────────

function teamSizeNumber(ts: string): number {
  if (ts === "1") return 1;
  if (ts === "2-5") return 3;
  if (ts === "6-15") return 10;
  if (ts === "16-50") return 25;
  return 60; // 50+
}

function isCoding(uc: UseCase): boolean {
  return uc === "Coding";
}
function isWriting(uc: UseCase): boolean {
  return uc === "Writing";
}
function isResearch(uc: UseCase): boolean {
  return uc === "Research";
}
function isData(uc: UseCase): boolean {
  return uc === "Data analysis";
}

// ── Per-tool rule engines ─────────────────────────────────────────────────────

function auditCursor(
  toolId: string,
  data: { planLabel: string; seats: number; monthlySpend: number },
  teamNum: number,
  useCase: UseCase
): ToolRecommendation {
  // PRICING SOURCE: verified 2025-05-21
  // Hobby $0, Pro $20/seat, Business $40/seat
  const CURSOR_PRO_PRICE = 20;
  const CURSOR_BIZ_PRICE = 40;

  const plan = data.planLabel;
  const seats = data.seats;

  // Rule 1: Seat reduction (highest priority — biggest savings)
  if ((plan === "Pro" || plan === "Business") && seats > Math.ceil(teamNum * 0.6)) {
    const recommended = Math.ceil(teamNum * 0.6);
    const planPrice = plan === "Business" ? CURSOR_BIZ_PRICE : CURSOR_PRO_PRICE;
    const savings = (seats - recommended) * planPrice;
    return {
      toolId,
      toolName: "Cursor",
      currentSpend: data.monthlySpend,
      action: `Reduce seats from ${seats} to ${recommended} (non-developer roles don't need access)`,
      potentialSaving: savings,
      reason: `Cursor is used by active developers only — non-engineering roles don't need seats. Recommended: ${recommended} of your ${teamNum} people.`,
      status: "overspending",
    };
  }

  // Rule 2: Business → Pro for non-coding teams with >5 seats
  if (plan === "Business" && seats > 5 && !isCoding(useCase)) {
    const savings = seats * CURSOR_PRO_PRICE;
    return {
      toolId,
      toolName: "Cursor",
      currentSpend: data.monthlySpend,
      action: `Switch from Business to Pro plan — save $${savings}/mo`,
      potentialSaving: savings,
      reason: "Business plan features (SSO, audit logs) are unnecessary for non-coding-primary teams.",
      status: "overspending",
    };
  }

  // Rule 3: Business with ≤5 seats — evaluate Pro
  if (plan === "Business" && seats <= 5) {
    const savings = seats * CURSOR_PRO_PRICE;
    return {
      toolId,
      toolName: "Cursor",
      currentSpend: data.monthlySpend,
      action: `Evaluate downgrading to Pro plan — potential saving $${savings}/mo`,
      potentialSaving: savings,
      reason: "At this seat count, Business-tier features (SSO, audit logs) are rarely needed. Pro covers most teams well.",
      status: "optimize",
    };
  }

  return {
    toolId,
    toolName: "Cursor",
    currentSpend: data.monthlySpend,
    action: "No action needed",
    potentialSaving: 0,
    reason: "Your Cursor plan and seat count are well-calibrated for your team.",
    status: "optimal",
  };
}

function auditGithubCopilot(
  toolId: string,
  data: { planLabel: string; seats: number; monthlySpend: number },
  teamNum: number,
  useCase: UseCase
): ToolRecommendation {
  // PRICING SOURCE: verified 2025-05-21
  // Individual $10/seat, Business $19/seat, Enterprise $39/seat
  const plan = data.planLabel;
  const seats = data.seats;

  // Rule 1: Enterprise with <20 seats → Business
  if (plan === "Enterprise" && seats < 20) {
    const savings = seats * 20;
    return {
      toolId,
      toolName: "GitHub Copilot",
      currentSpend: data.monthlySpend,
      action: `Downgrade from Enterprise to Business — save $${savings}/mo`,
      potentialSaving: savings,
      reason: "Enterprise features (audit logs, IP indemnity) are typically needed at 20+ seats. Business plan covers all core functionality.",
      status: "overspending",
    };
  }

  // Rule 2: Business with ≤3 seats → Individual
  if (plan === "Business" && seats <= 3) {
    const savings = seats * 9;
    return {
      toolId,
      toolName: "GitHub Copilot",
      currentSpend: data.monthlySpend,
      action: `Switch ${seats} seats from Business to Individual — save $${savings}/mo`,
      potentialSaving: savings,
      reason: "Business plan's policy management features are only valuable at 4+ seats.",
      status: "overspending",
    };
  }

  // Rule 3: Business on writing/research teams → Individual
  if (plan === "Business" && (isWriting(useCase) || isResearch(useCase))) {
    const savings = seats * 9;
    return {
      toolId,
      toolName: "GitHub Copilot",
      currentSpend: data.monthlySpend,
      action: `Switch to Individual plan for non-coding team — save $${savings}/mo`,
      potentialSaving: savings,
      reason: "GitHub Copilot Business is optimized for coding workflows — writing/research teams rarely use advanced features.",
      status: "overspending",
    };
  }

  return {
    toolId,
    toolName: "GitHub Copilot",
    currentSpend: data.monthlySpend,
    action: "No action needed",
    potentialSaving: 0,
    reason: "Your GitHub Copilot plan and seat count are appropriately sized.",
    status: "optimal",
  };
}

function auditClaude(
  toolId: string,
  data: { planLabel: string; seats: number; monthlySpend: number },
  useCase: UseCase
): ToolRecommendation {
  // PRICING SOURCE: verified 2025-05-21
  // Free $0, Pro $20/seat, Max $100/seat, Team $25/seat
  const plan = data.planLabel;
  const seats = data.seats;

  // Rule 1: Max for non-research/data teams → Pro
  if (plan === "Max ($100)" && !isResearch(useCase) && !isData(useCase)) {
    const savings = seats * 80;
    return {
      toolId,
      toolName: "Claude (Anthropic)",
      currentSpend: data.monthlySpend,
      action: `Downgrade from Max to Pro — save $${savings}/mo`,
      potentialSaving: savings,
      reason: "Claude Max's extended context and priority access benefits research/data workflows most — other use cases rarely hit Pro limits.",
      status: "overspending",
    };
  }

  // Rule 2: Team with <5 seats → Pro (Team requires min 5)
  if (plan === "Team" && seats < 5) {
    const savings = seats * 5;
    return {
      toolId,
      toolName: "Claude (Anthropic)",
      currentSpend: data.monthlySpend,
      action: `Switch to individual Pro subscriptions — Team plan requires min 5 seats, saving $${savings}/mo`,
      potentialSaving: savings,
      reason: "Claude Team plan requires minimum 5 seats — smaller teams overpay vs individual Pro subscriptions.",
      status: "overspending",
    };
  }

  // Rule 3: Pro with >10 seats on a coding team → evaluate Team
  if (plan === "Pro" && seats > 10 && isCoding(useCase)) {
    return {
      toolId,
      toolName: "Claude (Anthropic)",
      currentSpend: data.monthlySpend,
      action: "Evaluate upgrading to Team plan for admin controls at this scale",
      potentialSaving: 0,
      reason: "Team plan unlocks admin controls worth having at this scale — cost is $5/seat more but adds usage visibility.",
      status: "optimize",
    };
  }

  return {
    toolId,
    toolName: "Claude (Anthropic)",
    currentSpend: data.monthlySpend,
    action: "No action needed",
    potentialSaving: 0,
    reason: "Your Claude plan is well-matched to your team's use case and size.",
    status: "optimal",
  };
}

function auditChatGPT(
  toolId: string,
  data: { planLabel: string; seats: number; monthlySpend: number },
  teamNum: number,
  useCase: UseCase
): ToolRecommendation {
  // PRICING SOURCE: verified 2025-05-21
  // Plus $20/seat, Pro $200/seat, Team $25/seat
  const plan = data.planLabel;
  const seats = data.seats;

  // Rule 1: Team with more seats than team size → reduce
  if (plan === "Team" && seats > teamNum) {
    const savings = (seats - teamNum) * 25;
    return {
      toolId,
      toolName: "ChatGPT",
      currentSpend: data.monthlySpend,
      action: `Remove ${seats - teamNum} unused seats — reduce from ${seats} to ${teamNum}`,
      potentialSaving: savings,
      reason: "You have more ChatGPT seats than team members — remove unused seats.",
      status: "overspending",
    };
  }

  // Rule 2: Team with ≤2 seats → Plus
  if (plan === "Team" && seats <= 2) {
    const savings = seats * 5;
    return {
      toolId,
      toolName: "ChatGPT",
      currentSpend: data.monthlySpend,
      action: `Switch to Plus plan — Team workspace features need 3+ users, save $${savings}/mo`,
      potentialSaving: savings,
      reason: "ChatGPT Team's shared workspace features require 3+ members to be worthwhile.",
      status: "overspending",
    };
  }

  // Rule 3: Plus with >5 seats, not a writing team → evaluate Team
  if (plan === "Plus" && seats > 5 && !isWriting(useCase)) {
    return {
      toolId,
      toolName: "ChatGPT",
      currentSpend: data.monthlySpend,
      action: "Consider upgrading to Team plan for shared workspaces and admin visibility",
      potentialSaving: 0,
      reason: "Team plan adds collaboration features valuable for larger groups — worth evaluating at 6+ seats.",
      status: "optimize",
    };
  }

  return {
    toolId,
    toolName: "ChatGPT",
    currentSpend: data.monthlySpend,
    action: "No action needed",
    potentialSaving: 0,
    reason: "Your ChatGPT plan and seat count are well-calibrated.",
    status: "optimal",
  };
}

function auditWindsurf(
  toolId: string,
  data: { planLabel: string; seats: number; monthlySpend: number },
  useCase: UseCase
): ToolRecommendation {
  // PRICING SOURCE: verified 2025-05-21
  // Free $0, Pro $15/seat, Teams $35/seat
  const plan = data.planLabel;
  const seats = data.seats;

  // Rule 1: Teams with <4 seats → Pro
  if (plan === "Teams" && seats < 4) {
    const savings = seats * 20;
    return {
      toolId,
      toolName: "Windsurf",
      currentSpend: data.monthlySpend,
      action: `Switch from Teams to Pro plan — save $${savings}/mo`,
      potentialSaving: savings,
      reason: "Windsurf Teams' shared context features only add value at 4+ developers.",
      status: "overspending",
    };
  }

  // Rule 2: Pro on non-coding team → evaluate free tier
  if (plan === "Pro" && !isCoding(useCase)) {
    return {
      toolId,
      toolName: "Windsurf",
      currentSpend: data.monthlySpend,
      action: "Evaluate downgrading to the free tier — Windsurf is primarily a coding IDE",
      potentialSaving: 0,
      reason: "Windsurf is a coding IDE — non-coding teams rarely use it enough to justify the Pro plan.",
      status: "optimize",
    };
  }

  return {
    toolId,
    toolName: "Windsurf",
    currentSpend: data.monthlySpend,
    action: "No action needed",
    potentialSaving: 0,
    reason: "Your Windsurf plan is appropriate for your team's setup.",
    status: "optimal",
  };
}

function auditGemini(
  toolId: string,
  data: { planLabel: string; seats: number; monthlySpend: number },
  useCase: UseCase
): ToolRecommendation {
  // PRICING SOURCE: verified 2025-05-21
  // Pro $19.99/seat, Ultra/One AI Premium ~$249.99/seat
  const plan = data.planLabel;
  const seats = data.seats;

  if ((plan === "Ultra" || plan === "AI Premium") && !isData(useCase) && !isResearch(useCase)) {
    const savings = seats * 230;
    return {
      toolId,
      toolName: "Gemini (Google)",
      currentSpend: data.monthlySpend,
      action: `Downgrade from Ultra to Advanced — save ~$${savings}/mo`,
      potentialSaving: savings,
      reason: "Gemini Ultra's advanced reasoning benefits data/research teams most — other use cases are well-served by the Advanced plan.",
      status: "overspending",
    };
  }

  return {
    toolId,
    toolName: "Gemini (Google)",
    currentSpend: data.monthlySpend,
    action: "No action needed",
    potentialSaving: 0,
    reason: "Your Gemini plan is appropriate for your team's use case.",
    status: "optimal",
  };
}

function auditApiDirect(
  toolId: string,
  toolName: string,
  data: { monthlySpend: number }
): ToolRecommendation {
  // PRICING SOURCE: verified 2025-05-21
  const spend = data.monthlySpend;

  if (spend > 500) {
    return {
      toolId,
      toolName,
      currentSpend: spend,
      action: "Contact Credex for reserved capacity pricing or bulk credit discounts",
      potentialSaving: 0,
      reason: "API spend above $500/mo qualifies for volume discounts — contact Credex for credit pricing.",
      status: "optimize",
    };
  }

  if (spend > 200) {
    return {
      toolId,
      toolName,
      currentSpend: spend,
      action: "Review usage logs for idle or redundant API calls",
      potentialSaving: 0,
      reason: "API spend above $200/mo is worth auditing for waste — check for unused integrations or over-fetching patterns.",
      status: "optimize",
    };
  }

  return {
    toolId,
    toolName,
    currentSpend: spend,
    action: "No action needed",
    potentialSaving: 0,
    reason: "API spend is at a reasonable level for your scale.",
    status: "optimal",
  };
}

// ── Main engine ───────────────────────────────────────────────────────────────

export function runAuditEngine(formData: AuditFormData): AuditResult {
  const teamNum = teamSizeNumber(formData.teamSize);
  const useCase = formData.useCase;
  const tools = formData.tools;

  const recommendations: ToolRecommendation[] = [];
  let totalCurrentSpend = 0;

  // Tool names for display (matches mockData IDs)
  const TOOL_NAMES: Record<string, string> = {
    cursor: "Cursor",
    "github-copilot": "GitHub Copilot",
    windsurf: "Windsurf",
    replit: "Replit",
    tabnine: "Tabnine",
    "amazon-q": "Amazon Q Developer",
    bolt: "Bolt.new",
    claude: "Claude (Anthropic)",
    chatgpt: "ChatGPT",
    gemini: "Gemini (Google)",
    grok: "Grok (xAI)",
    perplexity: "Perplexity AI",
    mistral: "Mistral AI",
    "notion-ai": "Notion AI",
    midjourney: "Midjourney",
    runway: "Runway",
    "eleven-labs": "ElevenLabs",
    "anthropic-api": "Anthropic API Direct",
    "openai-api": "OpenAI API Direct",
    cohere: "Cohere",
    "together-ai": "Together AI",
    devin: "Devin (Cognition)",
  };

  for (const [toolId, data] of Object.entries(tools)) {
    if (!data.enabled) continue;

    const spend = data.monthlySpend ?? 0;
    totalCurrentSpend += spend;

    let rec: ToolRecommendation;

    if (toolId === "cursor") {
      rec = auditCursor(toolId, data, teamNum, useCase);
    } else if (toolId === "github-copilot") {
      rec = auditGithubCopilot(toolId, data, teamNum, useCase);
    } else if (toolId === "claude") {
      rec = auditClaude(toolId, data, useCase);
    } else if (toolId === "chatgpt") {
      rec = auditChatGPT(toolId, data, teamNum, useCase);
    } else if (toolId === "windsurf") {
      rec = auditWindsurf(toolId, data, useCase);
    } else if (toolId === "gemini") {
      rec = auditGemini(toolId, data, useCase);
    } else if (toolId === "anthropic-api") {
      rec = auditApiDirect(toolId, "Anthropic API Direct", data);
    } else if (toolId === "openai-api") {
      rec = auditApiDirect(toolId, "OpenAI API Direct", data);
    } else {
      // All other tools — include in spend, mark optimal
      rec = {
        toolId,
        toolName: TOOL_NAMES[toolId] ?? toolId,
        currentSpend: spend,
        action: "No action needed",
        potentialSaving: 0,
        reason: "Usage looks appropriate for your team size and use case.",
        status: "optimal",
      };
    }

    recommendations.push(rec);
  }

  const totalSavings = recommendations.reduce((s, r) => s + r.potentialSaving, 0);
  const annualSavings = totalSavings * 12;

  return {
    totalCurrentSpend,
    totalSavings,
    annualSavings,
    showCredexCTA: totalSavings > 500,
    recommendations,
    aiSummary: "", // filled in by generateSummary() in api.ts
    generatedAt: new Date().toISOString(),
  };
}

// Async wrapper — runs engine synchronously but gives pages a clean async API
export async function runAudit(formData: AuditFormData): Promise<AuditResult> {
  return new Promise((resolve) => {
    // Tiny delay so the loading state renders (feels intentional)
    setTimeout(() => resolve(runAuditEngine(formData)), 200);
  });
}
