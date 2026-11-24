/**
 * S08/S10 candidate ivory + plum semantic palette.
 * Additive design token layer. Existing Living Ledger styles are NOT replaced.
 * Visual approval and device screenshot audit are still required.
 */
export const semanticV1 = {
  bg: {
    canvas: "#F7F3ED",
    surface: "#FFFCF8",
    soft: "#F0E7E2",
  },
  text: {
    primary: "#292228",
    secondary: "#675A61",
    inverse: "#FFFFFF",
  },
  brand: {
    primary: "#663448",
    deep: "#4C2636",
    tint: "#F1E5E9",
  },
  status: {
    positive: "#1E6951",
    negative: "#A53E4B",
    warning: "#825419",
  },
  border: {
    subtle: "#D9CACB", // decorative only, not a control boundary
    control: "#907A80",
  },
} as const;
