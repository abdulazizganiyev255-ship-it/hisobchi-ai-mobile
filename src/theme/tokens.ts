/**
 * Hisobchi AI · D01 Design Foundation.
 * One shared source of truth for the approved ivory / plum identity.
 */
export const colors = {
  background: '#F7F1EB',
  backgroundDeep: '#F0E7E1',
  surface: '#FFFBF7',
  surfaceRaised: '#F3E7E5',
  primary: '#6D2C4E',
  primarySoft: '#F5E1EB',
  plumDeep: '#4A1F36',
  plumMid: '#8B496A',
  text: '#19191D',
  muted: '#65575E',
  faint: '#75646B', // WCAG AA body contrast on ivory and warm-white surfaces
  cardLight: '#FFFBF7',
  cardLightBottom: '#F4E8E4',
  ink: '#19191D',
  positive: '#24785B',
  negative: '#B14F5F',
  divider: 'rgba(109, 44, 78, 0.11)',
  line: '#E9DDDA',
  white: '#FFFFFF',
  warmPink: '#F6E4E8',
  warmGold: '#E7C5A3',
} as const;

export const spacing = {
  xs: 4, sm: 8, md: 12, base: 16,
  lg: 20, xl: 24, xxl: 32, huge: 40,
} as const;

export const radius = {
  sm: 12, md: 16, lg: 22, xl: 28, hero: 32, pill: 999,
} as const;

export const type = {
  caption: 11,
  body: 14,
  section: 18,
  title: 26,
  hero: 34,
} as const;

export const shadow = {
  card: {
    shadowColor: '#67354D',
    shadowOpacity: 0.10,
    shadowRadius: 22,
    shadowOffset: {width: 0, height: 12},
    elevation: 4,
  },
  light: {
    shadowColor: '#72515F',
    shadowOpacity: 0.07,
    shadowRadius: 16,
    shadowOffset: {width: 0, height: 6},
    elevation: 2,
  },
} as const;
