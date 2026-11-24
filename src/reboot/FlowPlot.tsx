import Svg, {Circle, Defs, LinearGradient, Path, Stop} from 'react-native-svg';
import {Text, View, StyleSheet} from 'react-native';
import type {AnalyticsDay} from '../data/analytics';
import {T} from './theme';

type Point = {x: number; y: number};

/** A monotone curve prevents false peaks when expenses change abruptly. */
export function curvePath(points: readonly Point[]): string {
  if (!points.length) return '';
  if (points.length === 1) return 'M ' + points[0].x + ' ' + points[0].y;
  let result = 'M ' + points[0].x + ' ' + points[0].y;
  for (let i = 0; i < points.length - 1; i++) {
    const prev = points[Math.max(0, i - 1)];
    const a = points[i];
    const b = points[i + 1];
    const next = points[Math.min(i + 2, points.length - 1)];
    const h = b.x - a.x;
    const secant = (b.y - a.y) / h;
    const left = (b.y - prev.y) / Math.max(1, b.x - prev.x);
    const right = (next.y - a.y) / Math.max(1, next.x - a.x);
    const tangent = (value: number) => value * secant <= 0 ? 0
      : Math.sign(secant) * Math.min(Math.abs(value), Math.abs(3 * secant));
    result += ' C ' + (a.x + h / 3).toFixed(2) + ' ' + (a.y + tangent(left) * h / 3).toFixed(2)
      + ' ' + (b.x - h / 3).toFixed(2) + ' ' + (b.y - tangent(right) * h / 3).toFixed(2)
      + ' ' + b.x.toFixed(2) + ' ' + b.y.toFixed(2);
  }
  return result;
}

export function FlowPlot({days}: {days: readonly AnalyticsDay[]}) {
  if (days.length < 2) {
    return (
      <View style={s.empty} testID="reboot-chart-empty">
        <Text style={s.emptyTitle}>Trend uchun hozircha yozuv kam</Text>
        <Text style={s.emptyText}>Kamida ikki xil sanadagi operatsiyalar kerak.</Text>
      </View>
    );
  }
  const max = Math.max(1, ...days.map(x => x.expense));
  const points = days.map((x, i) => ({
    x: 16 + 294 * i / (days.length - 1),
    y: 132 - x.expense / max * 100,
  }));
  const path = curvePath(points);
  const area = path + ' L ' + points[points.length - 1].x + ' 148 L ' + points[0].x + ' 148 Z';
  const description = 'Qayd etilgan ' + days.length + ' kunda xarajat: '
    + days.map(x => x.date + ' — ' + x.expense + ' so‘m').join('; ');
  return (
    <View testID="reboot-chart" style={s.plotWrap}>
      <Svg width="100%" height={154} viewBox="0 0 326 157"
        accessible accessibilityRole="image" accessibilityLabel={description}
        preserveAspectRatio="none">
        <Defs>
          <LinearGradient id="flowLineWash" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#2852E8" stopOpacity="0.20"/>
            <Stop offset="100%" stopColor="#2852E8" stopOpacity="0"/>
          </LinearGradient>
        </Defs>
        {[44, 89, 132].map((y) =>
          <Path key={y} d={'M 14 ' + y + ' H 313'} stroke="#E4E8E8"
            strokeWidth={1} strokeDasharray="3 5"/>
        )}
        <Path d={area} fill="url(#flowLineWash)"/>
        <Path d={path} fill="none" stroke={T.cobalt} strokeWidth={3.6}
          strokeLinecap="round" strokeLinejoin="round"/>
        {points.map((p, i) =>
          <Circle key={'daily-' + i} cx={p.x} cy={p.y} r={3.3}
            fill={T.paper} stroke={T.cobalt} strokeWidth={2.4}/>
        )}
      </Svg>
      <View style={s.axis}>
        <Text style={s.axisText}>{days[0].date.slice(5).replace('-', '.')}</Text>
        <Text style={s.axisText}>OPERATSIYA SANALARI</Text>
        <Text style={s.axisText}>{days[days.length - 1].date.slice(5).replace('-', '.')}</Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  plotWrap: {paddingTop: 6},
  axis: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 9},
  axisText: {fontSize: 9, fontWeight: '800', color: T.muted, letterSpacing: 0.3},
  empty: {minHeight: 145, justifyContent: 'center', alignItems: 'center', gap: 7},
  emptyTitle: {fontSize: 14, fontWeight: '800', color: T.ink},
  emptyText: {fontSize: 11, color: T.muted},
});
