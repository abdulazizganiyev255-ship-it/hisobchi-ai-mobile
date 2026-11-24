import type {MoneyDisplay, UZS} from "./types";

/** PostgreSQL signed BIGINT maximum. Never convert arbitrary ledger money to JS Number. */
const BIGINT_MAX = "9223372036854775807";

export function parseUzs(
  value: string,
  options: {allowZero?: boolean; allowNegative?: boolean} = {},
): UZS | null {
  if (typeof value !== "string") return null;
  // UI grouping spaces (including NBSP and narrow NBSP) are accepted.
  const compact = value.replace(/[ \u00a0\u202f]/g, "");
  if (!(options.allowNegative ? /^-?[0-9]+$/ : /^[0-9]+$/).test(compact)) return null;
  const negative = compact.startsWith("-");
  const digits = (negative ? compact.slice(1) : compact).replace(/^0+(?=[0-9])/, "");
  if (digits === "0" && !options.allowZero) return null;
  if (digits.length > BIGINT_MAX.length ||
      (digits.length === BIGINT_MAX.length && digits > BIGINT_MAX)) return null;
  return (negative && digits !== "0" ? "-" : "") + digits as UZS;
}

/** Adapter for existing, strictly safe-integer DEMO fixtures. Not for server data. */
export function fromSafeDemoNumber(amount: number): UZS {
  if (!Number.isSafeInteger(amount)) {
    throw new Error("UNSAFE_DEMO_AMOUNT: expected a safe integer");
  }
  const normalized = parseUzs(String(amount), {allowZero: true, allowNegative: true});
  if (normalized === null) throw new Error("INVALID_DEMO_AMOUNT");
  return normalized;
}

export function formatUzs(amount: UZS): string {
  const negative = amount.startsWith("-");
  const digits = negative ? amount.slice(1) : amount;
  const spaced = digits.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return (negative ? "−" : "") + spaced + " so‘m";
}

export function demoMoney(amountUzs: UZS, label: string): MoneyDisplay {
  if (!label.trim()) throw new Error("DEMO_SOURCE_LABEL_REQUIRED");
  return {kind: "demo_fixed", amountUzs, label};
}

export function sessionMoney(amountUzs: UZS, sessionId: string, period: string): MoneyDisplay {
  if (!sessionId.trim() || !period.trim()) throw new Error("SESSION_SOURCE_REQUIRED");
  return {kind: "session_calculated", amountUzs, sessionId, period};
}

export function verifiedMoney(
  amountUzs: UZS, snapshotVersion: string, asOf: string,
): MoneyDisplay {
  if (!snapshotVersion.trim() ||
      !/^\d{4}-\d{2}-\d{2}T/.test(asOf) ||
      !Number.isFinite(Date.parse(asOf))) {
    throw new Error("VERIFIED_SOURCE_METADATA_REQUIRED");
  }
  return {kind: "server_verified", amountUzs, snapshotVersion, asOf};
}

export function unavailableMoney(
  reason: Extract<MoneyDisplay, {kind: "unavailable"}>["reason"],
): MoneyDisplay {
  return {kind: "unavailable", amountUzs: null, reason};
}

export function provenanceLabel(money: MoneyDisplay): string {
  switch (money.kind) {
    case "demo_fixed": return "NAMUNA · hisoblanmagan";
    case "session_calculated": return "Demo sessiyadan hisoblangan";
    case "server_verified": return "Tasdiqlangan hisobiy ma’lumot";
    case "planned": return "Rejalashtirilgan";
    case "estimated": return "Taxminiy hisob";
    case "scenario": return "Sinov ssenariysi";
    case "unavailable": return "Ma’lumot yetarli emas yoki mavjud emas";
    default: {
      const exhaustive: never = money;
      return exhaustive;
    }
  }
}
