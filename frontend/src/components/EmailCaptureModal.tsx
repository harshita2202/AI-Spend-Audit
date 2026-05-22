import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveLead, sendConfirmationEmail } from "@/lib/api";
import type { AuditResult } from "@/lib/types";

interface EmailCaptureModalProps {
  open: boolean;
  onClose: () => void;
  auditId: string;
  totalSavings: number;
  annualSavings?: number;
  totalSpend?: number;
  recommendations?: AuditResult["recommendations"];
}

export function EmailCaptureModal({
  open,
  onClose,
  auditId,
  totalSavings,
  annualSavings = totalSavings * 12,
  totalSpend = 0,
  recommendations = [],
}: EmailCaptureModalProps) {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const honeypotRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Save lead to Supabase
      await saveLead({
        email,
        companyName: company || undefined,
        role: role || undefined,
        auditId,
        totalSavings,
        honeypot: honeypotRef.current?.value ?? "",
      });

      // Send confirmation email via Resend (fire-and-forget, never blocks UI)
      sendConfirmationEmail({
        email,
        firstName: undefined, // no first name field — avoids friction
        companyName: company || undefined,
        totalSavings,
        annualSavings,
        totalSpend,
        recommendations,
        auditId,
      }).catch(() => {
        // Swallow silently — email sending failure never surfaces to user
      });
    } finally {
      setSaving(false);
      setSubmitted(true);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md" data-testid="email-capture-modal">
        {!submitted ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl">Get notified of new optimizations</DialogTitle>
              <DialogDescription>
                We'll send your savings summary and alert you when new savings apply — no spam,
                unsubscribe anytime.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
              {/* Honeypot — hidden from real users, bots fill it in */}
              <input
                ref={honeypotRef}
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                style={{ display: "none" }}
              />

              <div>
                <Label htmlFor="modal-email" className="text-sm font-medium">
                  Work email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="modal-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="mt-1.5"
                  data-testid="input-modal-email"
                />
              </div>
              <div>
                <Label htmlFor="modal-company" className="text-sm font-medium">
                  Company{" "}
                  <span className="text-muted-foreground text-xs font-normal">(optional)</span>
                </Label>
                <Input
                  id="modal-company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Acme Inc."
                  className="mt-1.5"
                  data-testid="input-modal-company"
                />
              </div>
              <div>
                <Label htmlFor="modal-role" className="text-sm font-medium">
                  Your role{" "}
                  <span className="text-muted-foreground text-xs font-normal">(optional)</span>
                </Label>
                <Input
                  id="modal-role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="Engineering Manager"
                  className="mt-1.5"
                  data-testid="input-modal-role"
                />
              </div>
              <div className="flex gap-2 pt-1">
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={saving}
                  data-testid="button-modal-submit"
                >
                  {saving ? "Saving…" : "Get updates + email summary"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={saving}
                  data-testid="button-modal-skip"
                >
                  Skip
                </Button>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                We'll email you a copy of this audit. No spam. Shared links never reveal your email.
              </p>
            </form>
          </>
        ) : (
          <div className="text-center py-6">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Check your inbox</h3>
            <p className="text-muted-foreground text-sm mb-5">
              We've sent your savings summary to{" "}
              <strong className="text-foreground">{email}</strong>. We'll also notify you when
              new optimizations apply.
            </p>
            <Button onClick={onClose} data-testid="button-modal-done">
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
