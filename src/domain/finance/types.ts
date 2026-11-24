/**
 * S10-01 foundation types. No server, billing, or production data is accessed.
 * A UZS is a canonical, signed decimal string; validate at every I/O boundary.
 */
declare const uzsBrand: unique symbol;
export type UZS = string & {readonly [uzsBrand]: "UZS"};

export type MoneyDisplay =
  | {kind: "demo_fixed"; amountUzs: UZS; label: string}
  | {kind: "session_calculated"; amountUzs: UZS; sessionId: string; period: string}
  | {kind: "server_verified"; amountUzs: UZS; snapshotVersion: string; asOf: string}
  | {kind: "planned"; amountUzs: UZS; dueOn: string; label: string}
  | {kind: "estimated"; amountUzs: UZS; horizon: string; assumptions: readonly string[]}
  | {kind: "scenario"; amountUzs: UZS; scenarioId: string}
  | {kind: "unavailable"; amountUzs: null; reason: "insufficient_data" | "offline" | "error" | "not_configured"};

export type TransactionKind = "expense" | "income" | "transfer" | "refund";
export type TransactionSource = "manual" | "voice" | "csv";
export type TransactionDraft = {
  kind: TransactionKind;
  amountUzs: UZS; // positive magnitude; kind defines financial effect
  accountId: string;
  destinationAccountId?: string; // transfer only
  categoryId?: string;
  originalTransactionId?: string; // refund only
  occurredOn: string; // user-local calendar date
  note?: string;
  source: TransactionSource;
};

export type PostedTransaction = {
  transactionId: string;
  revision: number;
  status: "posted";
  snapshotVersion: string;
};

export type FinanceHomeSummary = {
  mode: "demo" | "verified";
  balance: MoneyDisplay;
  safeToSpend: MoneyDisplay;
  monthExpense: MoneyDisplay;
  recentTransactionCount: number;
};

export type FinancePeriod = "all" | "week" | "month" | "last30" | "custom";
export type FinanceQuery = {
  period: FinancePeriod;
  today: string;
  customRange?: {start: string; end: string} | null;
};
export type FinanceAnalyticsSummary = {
  source: "session" | "verified";
  period: {start: string | null; end: string | null};
  income: MoneyDisplay;
  expense: MoneyDisplay;
  net: MoneyDisplay;
  turnover: MoneyDisplay;
  transactionCount: number;
};
