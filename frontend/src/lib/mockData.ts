import type { AuditResult, ToolConfig } from "./types";

export const TOOLS: ToolConfig[] = [
  // ── Code assistants ──────────────────────────────────────────
  {
    id: "cursor",
    name: "Cursor",
    initials: "Cu",
    color: "#1a1a2e",
    plans: [
      { label: "Hobby", pricePerSeat: 0 },
      { label: "Pro", pricePerSeat: 20 },
      { label: "Business", pricePerSeat: 40 },
      { label: "Enterprise", pricePerSeat: null, custom: true },
    ],
  },
  {
    id: "github-copilot",
    name: "GitHub Copilot",
    initials: "GH",
    color: "#24292e",
    plans: [
      { label: "Individual", pricePerSeat: 10 },
      { label: "Business", pricePerSeat: 19 },
      { label: "Enterprise", pricePerSeat: 39 },
    ],
  },
  {
    id: "windsurf",
    name: "Windsurf",
    initials: "Ws",
    color: "#0f172a",
    plans: [
      { label: "Free", pricePerSeat: 0 },
      { label: "Pro", pricePerSeat: 15 },
      { label: "Teams", pricePerSeat: 35 },
      { label: "Enterprise", pricePerSeat: null, custom: true },
    ],
  },
  {
    id: "replit",
    name: "Replit",
    initials: "Rp",
    color: "#f26207",
    plans: [
      { label: "Free", pricePerSeat: 0 },
      { label: "Core", pricePerSeat: 25 },
      { label: "Teams", pricePerSeat: 40 },
      { label: "Enterprise", pricePerSeat: null, custom: true },
    ],
  },
  {
    id: "tabnine",
    name: "Tabnine",
    initials: "Tn",
    color: "#6e4fdc",
    plans: [
      { label: "Basic", pricePerSeat: 4 },
      { label: "Pro", pricePerSeat: 12 },
      { label: "Enterprise", pricePerSeat: null, custom: true },
    ],
  },
  {
    id: "amazon-q",
    name: "Amazon Q Developer",
    initials: "AQ",
    color: "#ff9900",
    plans: [
      { label: "Free", pricePerSeat: 0 },
      { label: "Pro", pricePerSeat: 19 },
    ],
  },
  {
    id: "bolt",
    name: "Bolt.new",
    initials: "Bl",
    color: "#6d28d9",
    plans: [
      { label: "Free", pricePerSeat: 0 },
      { label: "Pro", pricePerSeat: 20 },
      { label: "Teams", pricePerSeat: 25 },
    ],
  },

  // ── Chat / research ──────────────────────────────────────────
  {
    id: "claude",
    name: "Claude (Anthropic)",
    initials: "Cl",
    color: "#d4683a",
    plans: [
      { label: "Free", pricePerSeat: 0 },
      { label: "Pro", pricePerSeat: 20 },
      { label: "Max ($100)", pricePerSeat: 100 },
      { label: "Max ($200)", pricePerSeat: 200 },
      { label: "Team", pricePerSeat: 25 },
      { label: "Enterprise", pricePerSeat: null, custom: true },
      { label: "API Direct", pricePerSeat: null },
    ],
  },
  {
    id: "chatgpt",
    name: "ChatGPT (OpenAI)",
    initials: "GP",
    color: "#10a37f",
    plans: [
      { label: "Free", pricePerSeat: 0 },
      { label: "Plus", pricePerSeat: 20 },
      { label: "Pro", pricePerSeat: 200 },
      { label: "Team", pricePerSeat: 25 },
      { label: "Enterprise", pricePerSeat: null, custom: true },
      { label: "API Direct", pricePerSeat: null },
    ],
  },
  {
    id: "gemini",
    name: "Gemini (Google)",
    initials: "Gm",
    color: "#1a73e8",
    plans: [
      { label: "Free", pricePerSeat: 0 },
      { label: "Advanced", pricePerSeat: 19.99 },
      { label: "Business", pricePerSeat: 24 },
      { label: "Enterprise", pricePerSeat: 30 },
      { label: "API Direct", pricePerSeat: null },
    ],
  },
  {
    id: "grok",
    name: "Grok (xAI)",
    initials: "Gr",
    color: "#000000",
    plans: [
      { label: "X Premium", pricePerSeat: 8 },
      { label: "X Premium+", pricePerSeat: 16 },
      { label: "SuperGrok", pricePerSeat: 30 },
      { label: "API Direct", pricePerSeat: null },
    ],
  },
  {
    id: "perplexity",
    name: "Perplexity AI",
    initials: "Px",
    color: "#1c7ed6",
    plans: [
      { label: "Free", pricePerSeat: 0 },
      { label: "Pro", pricePerSeat: 20 },
      { label: "Enterprise", pricePerSeat: 40 },
      { label: "API Direct", pricePerSeat: null },
    ],
  },
  {
    id: "mistral",
    name: "Mistral AI",
    initials: "Ms",
    color: "#ff7000",
    plans: [
      { label: "Le Chat Free", pricePerSeat: 0 },
      { label: "Le Chat Pro", pricePerSeat: 14.99 },
      { label: "API Direct", pricePerSeat: null },
    ],
  },
  {
    id: "notion-ai",
    name: "Notion AI",
    initials: "No",
    color: "#000000",
    plans: [
      { label: "Free (limited)", pricePerSeat: 0 },
      { label: "AI Add-on", pricePerSeat: 8 },
      { label: "Enterprise AI", pricePerSeat: null, custom: true },
    ],
  },

  // ── Creative / media ─────────────────────────────────────────
  {
    id: "midjourney",
    name: "Midjourney",
    initials: "Mj",
    color: "#3d3d3d",
    plans: [
      { label: "Basic", pricePerSeat: 10 },
      { label: "Standard", pricePerSeat: 30 },
      { label: "Pro", pricePerSeat: 60 },
      { label: "Mega", pricePerSeat: 120 },
    ],
  },
  {
    id: "runway",
    name: "Runway",
    initials: "Rw",
    color: "#1d1d1d",
    plans: [
      { label: "Standard", pricePerSeat: 12 },
      { label: "Pro", pricePerSeat: 28 },
      { label: "Unlimited", pricePerSeat: 76 },
      { label: "Enterprise", pricePerSeat: null, custom: true },
    ],
  },
  {
    id: "eleven-labs",
    name: "ElevenLabs",
    initials: "EL",
    color: "#e15b2a",
    plans: [
      { label: "Free", pricePerSeat: 0 },
      { label: "Starter", pricePerSeat: 5 },
      { label: "Creator", pricePerSeat: 22 },
      { label: "Pro", pricePerSeat: 99 },
      { label: "Scale", pricePerSeat: 330 },
    ],
  },

  // ── API / infra ──────────────────────────────────────────────
  {
    id: "anthropic-api",
    name: "Anthropic API Direct",
    initials: "AN",
    color: "#b45309",
    plans: [{ label: "API Direct", pricePerSeat: null }],
    apiDirect: true,
  },
  {
    id: "openai-api",
    name: "OpenAI API Direct",
    initials: "OA",
    color: "#059669",
    plans: [{ label: "API Direct", pricePerSeat: null }],
    apiDirect: true,
  },
  {
    id: "cohere",
    name: "Cohere",
    initials: "Co",
    color: "#39594d",
    plans: [
      { label: "Trial", pricePerSeat: 0 },
      { label: "Production", pricePerSeat: null },
      { label: "Enterprise", pricePerSeat: null, custom: true },
    ],
    apiDirect: true,
  },
  {
    id: "together-ai",
    name: "Together AI",
    initials: "To",
    color: "#5b21b6",
    plans: [{ label: "API Direct", pricePerSeat: null }],
    apiDirect: true,
  },
  {
    id: "devin",
    name: "Devin (Cognition)",
    initials: "Dv",
    color: "#7c3aed",
    plans: [
      { label: "Teams", pricePerSeat: 500 },
      { label: "Enterprise", pricePerSeat: null, custom: true },
    ],
  },
];

export const MOCK_AUDIT_RESULT: AuditResult = {
  totalCurrentSpend: 732,
  totalSavings: 171,
  annualSavings: 2052,
  showCredexCTA: true,
  recommendations: [
    {
      toolId: "cursor",
      toolName: "Cursor",
      currentSpend: 320,
      action: "Downgrade 3 seats to Hobby (free) for non-developers",
      potentialSaving: 60,
      reason:
        "With 8 seats on Pro, 3 team members have minimal coding activity. The free Hobby tier covers casual users with no meaningful capability loss.",
      status: "overspending",
    },
    {
      toolId: "github-copilot",
      toolName: "GitHub Copilot",
      currentSpend: 152,
      action: "Switch 4 part-time devs to Individual plan ($10/seat)",
      potentialSaving: 36,
      reason:
        "4 developers use Copilot occasionally and don't need Business-tier features. Individual plan saves $9/seat/month with no workflow impact.",
      status: "optimize",
    },
    {
      toolId: "chatgpt",
      toolName: "ChatGPT",
      currentSpend: 200,
      action: "Reduce from 8 seats to 5 active seats",
      potentialSaving: 75,
      reason:
        "Usage logs show 3 seats with under 5 interactions/week — well below the threshold for a paid seat. 5 seats cover all active users.",
      status: "overspending",
    },
    {
      toolId: "claude",
      toolName: "Claude (Anthropic)",
      currentSpend: 60,
      action: "No action needed",
      potentialSaving: 0,
      reason:
        "3 seats on Claude Pro is well-calibrated for your team size and usage patterns. All seats show consistent, high-value usage.",
      status: "optimal",
    },
  ],
  aiSummary:
    "Your team is spending $732/month across four AI tools. The biggest quick win is right-sizing your Cursor and ChatGPT seat counts — you have more seats than active power users. Dropping 3 Cursor seats to the free Hobby tier and reducing ChatGPT to 5 seats saves $135/month with zero impact on your heaviest users. Your GitHub Copilot Business subscriptions are slightly over-provisioned for 4 part-time developers who'd be well served by the Individual plan. Your Claude usage looks well-calibrated. Total potential savings: $171/month, or $2,052 annually.",
  generatedAt: new Date().toISOString(),
};
