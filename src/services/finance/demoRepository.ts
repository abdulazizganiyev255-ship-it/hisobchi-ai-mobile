import {calculateAnalytics} from "../../data/analytics";
import {demo, type Transaction} from "../../data/demo";
import {demoMoney, fromSafeDemoNumber, sessionMoney} from "../../domain/finance/provenance";
import type {
  FinanceAnalyticsSummary,
  FinanceHomeSummary,
  FinanceQuery,
  PostedTransaction,
  TransactionDraft,
} from "../../domain/finance/types";
import type {FinanceRepository} from "./repository";

/**
 * Read-only adapter: preserves existing fixed sample Home values and
 * separately calculated local-session Analytics. NOT a backend implementation.
 * Existing editor state remains untouched until a later migration gate.
 */
export class DemoFinanceRepository implements FinanceRepository {
  constructor(
    private readonly getTransactions: () => readonly Transaction[],
    private readonly sessionId = "local-demo-session",
  ) {}

  async getHomeSummary(): Promise<FinanceHomeSummary> {
    return {
      mode: "demo",
      balance: demoMoney(fromSafeDemoNumber(demo.balance), "Namunaviy balans"),
      safeToSpend: demoMoney(
        fromSafeDemoNumber(demo.safeToSpendToday),
        "Safe-to-Spend hali Finance Engine bilan hisoblanmagan",
      ),
      monthExpense: demoMoney(
        fromSafeDemoNumber(demo.months.current.total),
        "Mustaqil oylik namuna grafigi",
      ),
      recentTransactionCount: this.getTransactions().length,
    };
  }

  async getAnalytics(query: FinanceQuery): Promise<FinanceAnalyticsSummary> {
    const report = calculateAnalytics(
      this.getTransactions(), query.period, query.today, query.customRange ?? null,
    );
    const period = (report.start ?? "all") + ":" + (report.end ?? "all");
    const money = (value: number) =>
      sessionMoney(fromSafeDemoNumber(value), this.sessionId, period);
    return {
      source: "session",
      period: {start: report.start, end: report.end},
      income: money(report.income),
      expense: money(report.expense),
      net: money(report.net),
      turnover: money(report.turnover),
      transactionCount: report.transactionsCount,
    };
  }

  async createTransaction(
    _draft: TransactionDraft, _requestId: string,
  ): Promise<PostedTransaction> {
    throw new Error("DEMO_READ_ONLY: a trusted posting endpoint is not connected");
  }
}
