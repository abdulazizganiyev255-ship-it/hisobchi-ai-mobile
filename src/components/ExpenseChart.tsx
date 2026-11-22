
import { View, StyleSheet, Text } from 'react-native';
import Svg, { Circle, Defs, Line, LinearGradient as SvgGradient, Path, Stop } from 'react-native-svg';
import { colors } from '../theme/tokens';

function spline(points: {x: number; y: number}[]) {
  return points.reduce((d, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const before = points[i - 1];
    const mid = (before.x + p.x) / 2;
    return `${d} C ${mid} ${before.y}, ${mid} ${p.y}, ${p.x} ${p.y}`;
  }, '');
}

export function ExpenseChart({values}: {values: number[]}) {
  const points = values.map((v, i) => ({x: 10 + i * (300 / (values.length - 1)), y: 112 - v * 95}));
  const topPoint = points.reduce((best, point) => point.y < best.y ? point : best, points[0]);
  const linePath = spline(points);
  const areaPath = `${linePath} L 310 122 L 10 122 Z`;
  return <View style={styles.wrapper}>
    <View style={styles.axisLabels}><Text style={styles.axis}>6M</Text><Text style={styles.axis}>4M</Text><Text style={styles.axis}>2M</Text><Text style={styles.axis}>0</Text></View>
    <View style={styles.graph}>
      <Svg width="100%" height="143" viewBox="0 0 320 143" preserveAspectRatio="none">
        <Defs><SvgGradient id="shade" x1="0" y1="0" x2="0" y2="1"><Stop offset="0" stopColor="#3AC8F8" stopOpacity="0.31"/><Stop offset="1" stopColor="#3AC8F8" stopOpacity="0.015"/></SvgGradient></Defs>
        {[26,58,90,122].map(y => <Line key={y} x1="9" y1={y} x2="311" y2={y} stroke="#BCE2F2" strokeWidth="0.65" strokeOpacity="0.19" strokeDasharray="4 4"/>)}
        <Path d={areaPath} fill="url(#shade)"/>
        <Path d={linePath} stroke="#57D3FF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <Circle cx={topPoint.x} cy={topPoint.y} r="5" fill="#46C3F5" stroke="white" strokeWidth="2.5"/>
      </Svg>
      <View style={styles.monthLabels}>{['1–7', '8–14', '15–21', '22–28'].map(x=><Text key={x} style={styles.day}>{x}</Text>)}</View>
    </View>
  </View>;
}

const styles = StyleSheet.create({
  wrapper: {flexDirection:'row', gap:10, marginTop:16},
  axisLabels: {height:126, justifyContent:'space-between', alignItems:'flex-end', width:26},
  axis: {fontSize:11, color:colors.faint},
  graph: {flex:1},
  monthLabels: {flexDirection:'row', justifyContent:'space-between', paddingHorizontal:9, marginTop:-3},
  day: {fontSize:11, color:colors.muted}
});
