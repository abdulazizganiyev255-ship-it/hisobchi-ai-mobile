import Svg, {Circle, Defs, LinearGradient, Path, Stop} from 'react-native-svg';

type Props = {
  values: readonly number[];
  previousValues: readonly number[];
  description: string;
  tone?: 'plum' | 'night';
};

type Point = {x: number; y: number};

const clamp = (n: number) => Number.isFinite(n) ? Math.max(0, Math.min(1, n)) : 0;
const pointsFor = (values: readonly number[]): Point[] =>
  values.map((value, i) => ({
    x: 13 + i * (294 / Math.max(1, values.length - 1)),
    y: 125 - clamp(value) * 98,
  }));

/** Smooth, bounded Catmull-Rom to cubic Bézier; no unbounded interpolated extrema. */
export function smoothCurve(points: readonly Point[]): string {
  if (!points.length) return '';
  if (points.length === 1) return 'M ' + points[0].x + ' ' + points[0].y;
  let d = 'M ' + points[0].x + ' ' + points[0].y;
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[Math.max(0, i - 1)];
    const b = points[i];
    const c = points[i + 1];
    const next = points[Math.min(points.length - 1, i + 2)];
    const dx = c.x - b.x;
    const c1x = b.x + dx / 3;
    const c2x = c.x - dx / 3;
    // Using monotonic cubic derivative clamps protects a normalized demo chart.
    const slope0 = (c.y - a.y) / Math.max(1, c.x - a.x);
    const slope1 = (next.y - b.y) / Math.max(1, next.x - b.x);
    const secant = (c.y - b.y) / Math.max(1, dx);
    const safeSlope = (s: number) => secant === 0 || s * secant <= 0
      ? 0 : Math.sign(secant) * Math.min(Math.abs(s), 3 * Math.abs(secant));
    const c1y = b.y + safeSlope(slope0) * dx / 3;
    const c2y = c.y - safeSlope(slope1) * dx / 3;
    d += ' C ' + c1x.toFixed(2) + ' ' + c1y.toFixed(2) +
      ' ' + c2x.toFixed(2) + ' ' + c2y.toFixed(2) +
      ' ' + c.x.toFixed(2) + ' ' + c.y.toFixed(2);
  }
  return d;
}

/**
 * An ILLUSTRATIVE normalized nine-point comparison, NOT a bank statement,
 * calendar series or UZS-valued plot. Previous month is dots, not a fake line.
 */
export function PremiumCashFlowChart({values, previousValues, description, tone = 'plum'}: Props) {
  const isNight = tone === 'night';
  const line = isNight ? '#C7FB58' : '#6A3550';
  const dot = isNight ? '#778C7F' : '#C7B0BA';
  const grid = isNight ? '#28333A' : '#EEE4E5';
  const area = isNight ? '#B7F14D' : '#9B5C78';
  const surface = isNight ? '#121820' : '#FFFCF8';
  const current = pointsFor(values);
  const previous = pointsFor(previousValues);
  if (current.length < 2) return null;
  const curve = smoothCurve(current);
  const filled = curve + ' L ' + current[current.length - 1].x + ' 143' +
    ' L ' + current[0].x + ' 143 Z';

  return (
    <Svg
      testID="living-ledger-chart"
      width="100%"
      height={148}
      viewBox="0 0 320 150"
      preserveAspectRatio="none"
      accessible
      accessibilityRole="image"
      accessibilityLabel={description}
    >
      <Defs>
        <LinearGradient id="premiumLineArea" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor={area} stopOpacity={isNight ? "0.25" : "0.20"}/>
          <Stop offset="100%" stopColor={area} stopOpacity="0"/>
        </LinearGradient>
      </Defs>
      {[42, 86, 131].map(y => (
        <Path key={y} d={'M 13 ' + y + ' H 307'}
          stroke={grid} strokeWidth={1}/>
      ))}
      <Path d={filled} fill="url(#premiumLineArea)"/>
      <Path d={curve} fill="none" stroke={line}
        strokeWidth={3.6} strokeLinecap="round" strokeLinejoin="round"/>
      {previous.map((p, i) => (
        <Circle key={'previous-' + i} cx={p.x} cy={p.y} r={2.8}
          fill={dot} opacity={0.92}/>
      ))}
      {current.map((p, i) =>
        (i === current.length - 1) ? (
          <Circle key="last-point" cx={p.x} cy={p.y} r={5.1}
            fill={line} stroke={surface} strokeWidth={2.8}/>
        ) : null
      )}
    </Svg>
  );
}
