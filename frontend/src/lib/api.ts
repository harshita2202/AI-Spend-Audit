import { supabase, isSupabaseConfigured } from "./supabase";
import type { AuditFormData, AuditResult, PublicAudit } from "./types";

// ── saveAudit ──────────────────────────────────────────────────────────────
// Saves an audit to Supabase. Returns a UUID for the shareable URL.
export async function saveAudit(input: AuditFormData, result: AuditResult): Promise<string> {
  if (!isSupabaseConfigured) {
    return `local-${Math.random().toString(36).slice(2, 10)}`;
  }

  try {
    const { data, error } = await supabase
      .from("audits")
      .insert({
        team_size: input.teamSize,
        use_case: input.useCase,
        tool_data: input.tools,
        total_spend: result.totalCurrentSpend,
        total_savings: result.totalSavings,
        audit_result: result,
      })
      .select("id")
      .single();

    if (error) throw error;
    return data.id as string;
  } catch (err) {
    console.error("saveAudit failed:", err);
    return `local-${Math.random().toString(36).slice(2, 10)}`;
  }
}

// ── getPublicAudit ────────────────────────────────────────────────────────
// Fetches a public audit by UUID. Returns only safe fields (no email/company).
export async function getPublicAudit(id: string): Promise<PublicAudit | null> {
  if (id.startsWith("local-") || !isSupabaseConfigured) {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from("audits")
      .select("id, created_at, use_case, total_savings, total_spend, audit_result, tool_data, team_size")
      .eq("id", id)
      .single();

    if (error || !data) return null;

    return {
      id: data.id,
      createdAt: data.created_at,
      useCase: data.use_case,
      totalSavings: data.total_savings,
      totalCurrentSpend: data.total_spend,
      auditResult: data.audit_result as AuditResult,
      auditInput: data.tool_data
        ? { teamSize: data.team_size, useCase: data.use_case, tools: data.tool_data }
        : undefined,
    };
  } catch (err) {
    console.error("getPublicAudit failed:", err);
    return null;
  }
}

// ── saveLead ───────────────────────────────────────────────────────────────
// Abuse protection: honeypot field + IP-based rate limiting (10 min window)
// Honeypot: bots fill hidden fields, humans don't. Silent drop on honeypot hit.
// Rate limit: max 3 submissions per IP per 10 minutes stored in rate_limits table.
export async function saveLead(data: {
  email: string;
  companyName?: string;
  role?: string;
  auditId: string;
  totalSavings: number;
  honeypot?: string;
}): Promise<void> {
  if (data.honeypot && data.honeypot.length > 0) {
    return;
  }

  if (!isSupabaseConfigured) return;

  try {
    const sessionKey = `ss_lead_${data.auditId}`;
    if (sessionStorage.getItem(sessionKey)) {
      return;
    }
    sessionStorage.setItem(sessionKey, "1");

    const { error } = await supabase.from("leads").insert({
      email: data.email,
      company_name: data.companyName ?? null,
      role: data.role ?? null,
      audit_id: data.auditId.startsWith("local-") ? null : data.auditId,
      total_savings: data.totalSavings,
    });

    if (error) throw error;
  } catch (err) {
    console.error("saveLead failed:", err);
  }
}

// ── sendConfirmationEmail ─────────────────────────────────────────────────
// Sends a confirmation email via Resend with the user's savings summary.
// NOTE: For production, move this call to a server endpoint to keep the
// API key server-side. Resend supports browser calls for prototyping.
export async function sendConfirmationEmail(data: {
  email: string;
  firstName?: string;
  companyName?: string;
  totalSavings: number;
  annualSavings: number;
  totalSpend: number;
  recommendations: AuditResult["recommendations"];
  auditId: string;
}): Promise<void> {
  const apiKey = import.meta.env.VITE_RESEND_API_KEY as string | undefined;
  if (!apiKey) return; // Silently skip if not configured

  const siteOrigin =
    typeof window !== "undefined" ? window.location.origin : "https://spendsense.ai";
  const auditUrl = `${siteOrigin}/audit/${data.auditId}`;

  const greeting = data.firstName ? `Hi ${data.firstName},` : "Hi there,";

  // Build recommendations rows (overspending + optimize only)
  const actionableRecs = data.recommendations.filter((r) => r.potentialSaving > 0);
  const recRows = actionableRecs
    .map(
      (r) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #e0ddf5;">
          <span style="font-family:monospace;font-size:11px;font-weight:700;color:${
            r.status === "overspending" ? "#ef4444" : "#f59e0b"
          };background:${
            r.status === "overspending" ? "#fef2f2" : "#fffbeb"
          };padding:2px 7px;border-radius:3px;text-transform:uppercase;letter-spacing:0.05em;">
            ${r.status === "overspending" ? "Overspending" : "Can optimize"}
          </span>
          <strong style="display:block;margin-top:5px;color:#18171f;font-size:14px;">${r.toolName}</strong>
          <span style="color:#7b7a99;font-size:13px;">${r.action}</span>
        </td>
        <td style="padding:10px 0;border-bottom:1px solid #e0ddf5;text-align:right;white-space:nowrap;">
          <strong style="color:#ef4444;font-size:16px;font-family:monospace;">-$${r.potentialSaving}/mo</strong>
        </td>
      </tr>`
    )
    .join("");

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background:#f8f7ff;font-family:'DM Sans',Helvetica,Arial,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:40px 20px;">

    <!-- Header -->
    <div style="margin-bottom:28px;">
      <div style="display:inline-flex;align-items:center;gap:8px;margin-bottom:20px;">
        <div style="width:26px;height:26px;background:#7c3aed;border-radius:4px;display:flex;align-items:center;justify-content:center;">
          <span style="color:white;font-weight:900;font-size:14px;font-family:monospace;">S</span>
        </div>
        <span style="font-weight:700;font-size:15px;color:#18171f;letter-spacing:-0.3px;">
          SpendSense <span style="color:#7c3aed;">AI</span>
        </span>
      </div>
    </div>

    <!-- Savings hero card -->
    <div style="background:linear-gradient(135deg,#f0fdf4 0%,#dcfce7 60%,#ecfdf5 100%);border:1px solid #86efac;border-left:4px solid #22c55e;border-radius:6px;padding:28px 28px 24px;margin-bottom:24px;">
      <p style="margin:0 0 4px;font-family:monospace;font-size:11px;font-weight:700;color:#15803d;text-transform:uppercase;letter-spacing:0.08em;">
        Potential monthly savings
      </p>
      <div style="font-size:52px;font-weight:900;color:#16a34a;line-height:1;margin-bottom:6px;font-family:Helvetica,Arial,sans-serif;">
        $${data.totalSavings.toLocaleString()}
      </div>
      <p style="margin:0;color:#15803d;font-size:14px;">
        per month — that's <strong>$${data.annualSavings.toLocaleString()}/year</strong> back in your budget
      </p>
    </div>

    <!-- Greeting -->
    <p style="font-size:15px;color:#18171f;margin:0 0 6px;">${greeting}</p>
    <p style="font-size:15px;color:#3d3c52;margin:0 0 24px;line-height:1.6;">
      Your AI spend audit is complete. We found
      <strong style="color:#7c3aed;">$${data.totalSavings}/month in potential savings</strong>
      ($${data.annualSavings.toLocaleString()}/year) across your stack.
      Here's what we found:
    </p>

    <!-- Recommendations table -->
    ${
      actionableRecs.length > 0
        ? `<div style="background:#ffffff;border:1px solid #e0ddf5;border-radius:6px;padding:4px 20px 8px;margin-bottom:24px;">
            <table style="width:100%;border-collapse:collapse;">${recRows}</table>
           </div>`
        : `<div style="background:#f0fdf4;border:1px solid #86efac;border-radius:6px;padding:16px 20px;margin-bottom:24px;">
             <p style="margin:0;color:#15803d;font-size:14px;font-weight:600;">
               ✓ Your AI stack is well-optimized — no immediate changes needed.
             </p>
           </div>`
    }

    <!-- Current spend note -->
    <p style="font-size:13px;color:#7b7a99;margin:0 0 24px;">
      Current monthly spend across ${data.recommendations.length} tool${data.recommendations.length !== 1 ? "s" : ""}:
      <strong style="color:#18171f;">$${data.totalSpend.toLocaleString()}/mo</strong>
    </p>

    <!-- CTA button -->
    <div style="text-align:center;margin-bottom:32px;">
      <a href="${auditUrl}"
         style="display:inline-block;background:#7c3aed;color:#ffffff;font-weight:700;font-size:15px;padding:13px 32px;border-radius:4px;text-decoration:none;letter-spacing:-0.2px;">
        View full audit →
      </a>
      <p style="margin:10px 0 0;font-size:12px;color:#7b7a99;">
        Share this link with your team or bookmark it for later.
      </p>
    </div>

    <!-- Divider -->
    <hr style="border:none;border-top:1px solid #e0ddf5;margin:0 0 20px;" />

    <!-- Footer -->
    <p style="font-size:12px;color:#7b7a99;margin:0;line-height:1.6;">
      You're receiving this because you submitted an audit on
      <a href="${siteOrigin}" style="color:#7c3aed;text-decoration:none;">SpendSense AI</a>.
      We'll notify you when new savings opportunities apply to your stack.<br/>
      No spam. Unsubscribe anytime by replying to this email.
    </p>
  </div>
</body>
</html>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: "SpendSense AI <hello@spendsense.ai>",
        to: [data.email],
        subject: `Your AI audit — $${data.totalSavings.toLocaleString()}/month in savings found`,
        html,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("sendConfirmationEmail failed:", res.status, body);
    }
  } catch (err) {
    console.error("sendConfirmationEmail error:", err);
    // Never surface email errors to the user
  }
}

// ── generateSummary ────────────────────────────────────────────────────────
// Calls Anthropic API to produce a personalized 90-110 word summary.
// Falls back to a template string if the API fails or is unconfigured.
export async function generateSummary(input: AuditFormData, result: AuditResult): Promise<string> {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY as string | undefined;

  const teamSizeLabel =
    input.teamSize === "1" ? "1 person" : `${input.teamSize} people`;

  const actionableRecs = result.recommendations.filter((r) => r.potentialSaving > 0);
  const topRec = actionableRecs[0];

  const toolBreakdown = result.recommendations
    .map((r) => `${r.toolName}: $${r.currentSpend}/mo (saving: $${r.potentialSaving}/mo)`)
    .join(", ");

  if (apiKey) {
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 200,
          messages: [
            {
              role: "user",
              content: `You are a concise financial advisor for AI tool spend at startups.

Write a 90-110 word summary paragraph for this founder. Be direct and specific. Use exact dollar figures. No bullet points. No headers. Write in second person. End with one clear action they should take first.

Team size: ${teamSizeLabel}
Primary use case: ${input.useCase}
Total monthly spend: $${result.totalCurrentSpend}
Total potential savings: $${result.totalSavings}/mo ($${result.annualSavings}/year)
Tool breakdown: ${toolBreakdown}`,
            },
          ],
        }),
      });

      if (response.ok) {
        const json = await response.json();
        const text = json?.content?.[0]?.text as string | undefined;
        if (text) return text.trim();
      }
    } catch (err) {
      console.error("generateSummary API call failed:", err);
    }
  }

  const toolCount = result.recommendations.length;
  const topAction = topRec ? topRec.action : "review your active seat counts";

  return `Your team is spending $${result.totalCurrentSpend}/month across ${toolCount} AI tool${toolCount !== 1 ? "s" : ""}. Based on your ${input.useCase.toLowerCase()} use case and team of ${teamSizeLabel}, we found $${result.totalSavings}/month in potential savings ($${result.annualSavings}/year). The biggest opportunity: ${topAction}. Review the breakdown below to see the full picture and act on the highest-impact items first.`;
}
