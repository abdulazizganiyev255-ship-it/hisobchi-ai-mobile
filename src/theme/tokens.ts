export const colors = {
  background: '#07182C',
  backgroundDeep: '#051426',
  surface: '#0D2844',
  surfaceRaised: '#143755',
  primary: '#48C1F4',
  primarySoft: '#9EE3FF',
  text: '#F5F9FF',
  muted: '#ADC0D5',
  faint: '#7C99B5',
  cardLight: '#E8F6FF',
  cardLightBottom: '#B6E8FA',
  ink: '#08223A',
  positive: '#4CD4B0',
  negative: '#F59B9B',
  divider: 'rgba(184,220,247,0.15)',
} as const;

export const spacing = { xs: 4, sm: 8, md: 12, base: 16, lg: 20, xl: 24, xxl: 32 } as const;
export const radius = { sm: 12, md: 16, lg: 22, xl: 28, pill: 999 } as const;

export const shadow = {
  card: { shadowColor: '#000000', shadowOpacity: 0.15, shadowRadius: 20, shadowOffset: {width: 0, height: 12}, elevation: 4 },
  light: { shadowColor: '#4FC3F7', shadowOpacity: 0.15, shadowRadius: 18, shadowOffset: {width: 0, height: 8}, elevation: 3 },
} as const;


/**
 * Design System v1.0 foundations.
 *
 * These semantic roles are additive: existing screens keep using colors,
 * spacing and radius while shared components gradually replace one-off styles.
 * All size values are React Native dp (and CSS px on React Native Web).
 */
export const typography = {
  size: {
    micro: 10,       // badges / brief metadata only
    caption: 12,
    label: 13,
    body: 14,
    section: 16,
    page: 24,
    amount: 29,
  },
  lineHeight: {
    caption: 17,
    body: 21,
    section: 23,
    page: 30,
  },
  weight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    heavy: '800',
  },
} as const;

export const layout = {
  screenGutter: 18,
  sectionGap: 12,
  inlineGap: 9,
  touchTarget: 44,
  smallViewport: 320,
  referenceViewport: 393,
} as const;

export const semantic = {
  darkPanel: colors.surface,
  lightPanel: colors.cardLight,
  darkText: colors.text,
  lightText: colors.ink,
  darkSubtext: colors.muted,
  lightSubtext: '#52778E',
  focusBorder: colors.primary,
  sectionIconDark: '#193B59',
  sectionIconLight: '#CAE9F7',
  activeControl: '#235B81',
  inactiveControl: '#0A223A',
  strongBorder: 'rgba(160,224,250,0.22)',
} as const;
