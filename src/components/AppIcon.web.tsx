import React from 'react';

// Web-only implementation: use React DOM SVG directly, avoiding react-native-svg's WebShape renderer.
// Android and iOS continue using AppIcon.tsx.
export type IconName =
  | 'home' | 'chart' | 'wallet' | 'receipt' | 'user' | 'eye' | 'eye-off'
  | 'shield' | 'chevron' | 'chevron-down' | 'bell' | 'cart' | 'bus'
  | 'coffee' | 'heart' | 'arrow-left' | 'check' | 'plus';

type Props = {
  name: IconName;
  color?: string;
  size?: number;
  strokeWidth?: number;
};

const paths: Record<IconName, string> = {
  home: 'M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z',
  chart: 'M3 12h4v9H3zM10 7h4v14h-4zM17 3h4v18h-4z',
  wallet: 'M3 6h18v15H3a3 3 0 0 1-3-3V9a3 3 0 0 1 3-3zM3 10h18M6 6V4h12M16 15h2',
  receipt: 'M5 3h14v18l-3.5-2-3.5 2-3.5-2L5 21V3zm4 5h6m-6 4h6',
  user: 'M16 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM4 21c0-5 3-8 8-8s8 3 8 8',
  eye: 'M2 12s3.8-6 10-6 10 6 10 6-3.8 6-10 6-10-6-10-6zM15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z',
  'eye-off': 'M3 3l18 18M10 6.2c.7-.1 1.3-.2 2-.2 6.2 0 10 6 10 6a16 16 0 0 1-3.8 3.9M6.6 6.6C3.6 8.2 2 12 2 12s3.8 6 10 6c1.3 0 2.5-.2 3.6-.7',
  shield: 'M12 2 20 5v6c0 5.2-3.2 8.7-8 11-4.8-2.3-8-5.8-8-11V5l8-3zm-4 10 2.5 2.5L16 9',
  chevron: 'M9 5l7 7-7 7',
  'chevron-down': 'M5 9l7 7 7-7',
  bell: 'M18 8a6 6 0 0 0-12 0c0 7-3 8-3 8h18s-3-1-3-8zM10 21h4',
  cart: 'M2 4h3l2.5 12h12L22 8H6M9 20h.01M18 20h.01',
  bus: 'M4 12h16M8 20v2m8-2v2M8 7h8M8 16h.01M16 16h.01M8 3h8a4 4 0 0 1 4 4v9a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4z',
  coffee: 'M4 6h14v8a7 7 0 0 1-14 0V6zm14 2h2a3 3 0 0 1 0 6h-2M3 21h17',
  heart: 'M20.8 5.6a5 5 0 0 0-7.1 0L12 7.3l-1.7-1.7a5 5 0 0 0-7.1 7.1L12 21l8.8-8.3a5 5 0 0 0 0-7.1z',
  'arrow-left': 'M20 12H4m7-7-7 7 7 7',
  check: 'M4 12l5 5L20 6',
  plus: 'M12 4v16M4 12h16',
};

export function AppIcon({
  name,
  color = '#FFFFFF',
  size = 22,
  strokeWidth = 1.8,
}: Props) {
  return React.createElement(
    'svg',
    {
      width: size,
      height: size,
      viewBox: '0 0 24 24',
      fill: 'none',
      focusable: false,
      'aria-hidden': true,
      style: { display: 'block', flexShrink: 0 },
    },
    React.createElement('path', {
      d: paths[name],
      fill: 'none',
      stroke: color,
      strokeWidth,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
    }),
  );
}
