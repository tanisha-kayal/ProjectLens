
export enum RiskLevel {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High'
}

export interface RiskItem {
  name: string;
  why: string;
  reference: string;
}

export interface Suggestion {
  riskName: string;
  action: string;
}

export interface AuditReport {
  riskLevel: RiskLevel;
  riskJustification: string;
  topRisks: RiskItem[];
  fixNowSuggestions: Suggestion[];
}

export interface AppState {
  projectPlan: string;
  report: AuditReport | null;
  isLoading: boolean;
  error: string | null;
}
