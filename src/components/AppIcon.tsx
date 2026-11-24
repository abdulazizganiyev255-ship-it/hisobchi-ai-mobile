import React from 'react';
import Svg, { Circle, Line, Path, Polyline, Rect } from 'react-native-svg';

export type IconName = 'home' | 'chart' | 'wallet' | 'receipt' | 'user' | 'eye' | 'eye-off' | 'shield' | 'chevron' | 'chevron-down' | 'bell' | 'cart' | 'bus' | 'coffee' | 'heart' | 'arrow-left' | 'check' | 'plus' | 'sparkles' | 'mic';

type Props = { name: IconName; color?: string; size?: number; strokeWidth?: number };

export function AppIcon({name, color = '#FFFFFF', size = 22, strokeWidth = 1.8}: Props) {
  const p = {fill: 'none' as const, stroke: color, strokeWidth, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};
  const path = (d: string) => <Path d={d} {...p} />;
  let shape: React.ReactNode;
  switch (name) {
    case 'home': shape = path('M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z'); break;
    case 'chart': shape = <><Rect x="3" y="12" width="4" height="9" rx="1" {...p}/><Rect x="10" y="7" width="4" height="14" rx="1" {...p}/><Rect x="17" y="3" width="4" height="18" rx="1" {...p}/></>; break;
    case 'wallet': shape = <><Rect x="3" y="6" width="18" height="15" rx="3" {...p}/>{path('M3 10h18M6 6V4h12') }<Circle cx="17" cy="15" r="1" fill={color}/></>; break;
    case 'receipt': shape = path('M5 3h14v18l-3.5-2-3.5 2-3.5-2L5 21V3zm4 5h6m-6 4h6'); break;
    case 'user': shape = <><Circle cx="12" cy="8" r="4" {...p}/>{path('M4 21c0-5 3-8 8-8s8 3 8 8')}</>; break;
    case 'eye': shape = <>{path('M2 12s3.8-6 10-6 10 6 10 6-3.8 6-10 6-10-6-10-6z')}<Circle cx="12" cy="12" r="3" {...p}/></>; break;
    case 'eye-off': shape = <>{path('M3 3l18 18M10 6.2c.7-.1 1.3-.2 2-.2 6.2 0 10 6 10 6a16 16 0 0 1-3.8 3.9M6.6 6.6C3.6 8.2 2 12 2 12s3.8 6 10 6c1.3 0 2.5-.2 3.6-.7')}</>; break;
    case 'shield': shape = path('M12 2 20 5v6c0 5.2-3.2 8.7-8 11-4.8-2.3-8-5.8-8-11V5l8-3zm-4 10 2.5 2.5L16 9'); break;
    case 'chevron': shape = <Polyline points="9 5 16 12 9 19" {...p}/>; break;
    case 'chevron-down': shape = <Polyline points="5 9 12 16 19 9" {...p}/>; break;
    case 'bell': shape = path('M18 8a6 6 0 0 0-12 0c0 7-3 8-3 8h18s-3-1-3-8zM10 21h4'); break;
    case 'cart': shape = path('M2 4h3l2.5 12h12L22 8H6M9 20h.01M18 20h.01'); break;
    case 'bus': shape = <><Rect x="4" y="3" width="16" height="17" rx="4" {...p}/>{path('M4 12h16M8 20v2m8-2v2M8 7h8')}<Circle cx="8" cy="16" r="1" fill={color}/><Circle cx="16" cy="16" r="1" fill={color}/></>; break;
    case 'coffee': shape = path('M4 6h14v8a7 7 0 0 1-14 0V6zm14 2h2a3 3 0 0 1 0 6h-2M3 21h17'); break;
    case 'heart': shape = path('M20.8 5.6a5 5 0 0 0-7.1 0L12 7.3l-1.7-1.7a5 5 0 0 0-7.1 7.1L12 21l8.8-8.3a5 5 0 0 0 0-7.1z'); break;
    case 'arrow-left': shape = path('M20 12H4m7-7-7 7 7 7'); break;
    case 'check': shape = path('M4 12l5 5L20 6'); break;
    case 'sparkles': shape = <>{path('M12 2l2.1 6.9L21 11l-6.9 2.1L12 20l-2.1-6.9L3 11l6.9-2.1L12 2zM19 18l.9 1.8L22 20.7l-2.1.9L19 24l-.9-2.4-2.1-.9 2.1-.9L19 18z')}</>; break;
    case 'mic': shape = <><Rect x="9" y="2" width="6" height="13" rx="3" {...p}/>{path('M5 11a7 7 0 0 0 14 0M12 18v4m-4 0h8')}</>; break;
    case 'plus': shape = <><Line x1="12" y1="4" x2="12" y2="20" {...p}/><Line x1="4" y1="12" x2="20" y2="12" {...p}/></>; break;
  }
  return <Svg width={size} height={size} viewBox="0 0 24 24" accessible={false}>{shape}</Svg>;
}
