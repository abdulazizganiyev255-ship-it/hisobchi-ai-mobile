/**
 * Living Ledger pilot tokens: intentionally scoped to Home while other
 * screens remain in the existing Design System during migration.
 * Palette measured for contrast against #F7F5EF.
 */
export const ledger = {
  paper: '#F7F5EF',
  surface: '#FFFFFF',
  ink: '#142821',
  subtext: '#536159',
  rule: '#CDD1C7',
  dark: '#1D4D3C',
  sage: '#6D8E74',
  paleSage: '#E7EEE3',
  coral: '#F27452',
  badge: '#F6D6CA',
  badgeText: '#713D2C',
  barFaint: '#6D8E74',
  chartActive: '#466C55',
  nav: '#F7F5EF',
} as const;

export const ledgerSpace = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  section: 30,
} as const;
