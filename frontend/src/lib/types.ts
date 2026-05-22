export type TeamSize = "1" | "2-5" | "6-15" | "16-50" | "50+";

export type UseCase = "Coding" | "Writing" | "Data analysis" | "Research" | "Mixed";

export type ToolPlan = {
  label: string;
  pricePerSeat: number | null;
  custom?: boolean;
};

export type ToolConfig = {
  id: string;
  name: string;
  initials: string;
  color: string;
  plans: ToolPlan[];
  apiDirect?: boolean;
};

export type ToolFormData = {
  enabled: boolean;
  planLabel: string;
  monthlySpend: number;
  seats: number;
};

export type AuditFormData = {
  teamSize: TeamSize;
  useCase: UseCase;
  tools: Record<string, ToolFormData>;
};

export type SavingsStatus = "overspending" | "optimize" | "optimal";

export type ToolRecommendation = {
  toolId: string;
  toolName: string;
  currentSpend: number;
  action: string;
  potentialSaving: number;
  reason: string;
  status: SavingsStatus;
};

export type AuditResult = {
  totalCurrentSpend: number;
  totalSavings: number;
  annualSavings: number;
  showCredexCTA: boolean;
  recommendations: ToolRecommendation[];
  aiSummary: string;
  generatedAt: string;
};

export type PublicAudit = {
  id: string;
  createdAt: string;
  useCase: string;
  totalSavings: number;
  totalCurrentSpend: number;
  auditResult: AuditResult;
  auditInput?: AuditFormData;
};
