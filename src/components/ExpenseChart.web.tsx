import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { colors } from '../theme/tokens';

// Web-only chart: regular browser SVG avoids the react-native-svg WebShape error.
// Native platforms continue using ExpenseChart.tsx.
function spline(points: { x: number; y: number }[]) {
  return points.reduce((d, p, i) => {
    if (i === 0) return 'M ' + p.x + ' ' + p.y;
    const before = points[i - 1];
    const mid = (before.x + p.x) / 2;
    return d + ' C ' + mid + ' ' + before.y + ', ' + mid + ' ' + p.y + ', ' + p.x + ' ' + p.y;
  }, '');
}

export function ExpenseChart({ values }: { values: number[] }) {
  const source = values.length > 1 ? values : [0, 0];
  const points = source.map((v, i) => ({
    x: 10 + i * (300 / (source.length - 1)),
    y: 112 - Math.max(0, Math.min(1, v)) * 95,
  }));
  const topPoint = points.reduce(
    (best, point) => (point.y < best.y ? point : best),
    points[0],
  );
  const linePath = spline(points);
  const areaPath = linePath + ' L 310 122 L 10 122 Z';

  const chart = React.createElement(
    'svg',
    {
      width: '100%',
      height: 143,
      viewBox: '0 0 320 143',
      preserveAspectRatio: 'none',
      'aria-hidden': true,
      style: { display: 'block', width: '100%', height: 143 },
    },
    React.createElement(
      'defs',
      null,
      React.createElement(
        'linearGradient',
        { id: 'expenseShade', x1: '0', y1: '0', x2: '0', y2: '1' },
        React.createElement('stop', {
          offset: '0',
          stopColor: '#3AC8F8',
          stopOpacity: 0.31,
        }),
        React.createElement('stop', {
          offset: '1',
          stopColor: '#3AC8F8',
          stopOpacity: 0.015,
        }),
      ),
    ),
    ...[26, 58, 90, 122].map((y) =>
      React.createElement('line', {
        key: y,
        x1: 9,
        y1: y,
        x2: 311,
        y2: y,
        stroke: '#BCE2F2',
        strokeWidth: 0.65,
        strokeOpacity: 0.19,
        strokeDasharray: '4 4',
      }),
    ),
    React.createElement('path', {
      d: areaPath,
      fill: 'url(#expenseShade)',
    }),
    React.createElement('path', {
      d: linePath,
      stroke: '#57D3FF',
      strokeWidth: 3,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      fill: 'none',
    }),
    React.createElement('circle', {
      cx: topPoint.x,
      cy: topPoint.y,
      r: 5,
      fill: '#46C3F5',
      stroke: '#FFFFFF',
      strokeWidth: 2.5,
    }),
  );

  return (
    <View style={styles.wrapper}>
      <View style={styles.axisLabels}>
        <Text style={styles.axis}>6M</Text>
        <Text style={styles.axis}>4M</Text>
        <Text style={styles.axis}>2M</Text>
        <Text style={styles.axis}>0</Text>
      </View>
      <View style={styles.graph}>
        {chart}
        <View style={styles.monthLabels}>
          {['1–7', '8–14', '15–21', '22–28'].map((x) => (
            <Text key={x} style={styles.day}>{x}</Text>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flexDirection: 'row', gap: 10, marginTop: 16 },
  axisLabels: { height: 126, justifyContent: 'space-between', alignItems: 'flex-end', width: 26 },
  axis: { fontSize: 11, color: colors.faint },
  graph: { flex: 1 },
  monthLabels: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 9, marginTop: -3 },
  day: { fontSize: 11, color: colors.muted },
});
