import type {
  FinanceAnalyticsSummary,
  FinanceHomeSummary,
  FinanceQuery,
  PostedTransaction,
  TransactionDraft,
} from "../../domain/finance/types";

/**
 * UI contract only. A production implementation MUST enforce verified Auth,
 * ownership, RLS, idempotency and atomic posting on the trusted server.
 */
export interface FinanceRepository {
  getHomeSummary(): Promise<FinanceHomeSummary>;
  getAnalytics(query: FinanceQuery): Promise<FinanceAnalyticsSummary>;
  createTransaction(draft: TransactionDraft, requestId: string): Promise<PostedTransaction>;
}
