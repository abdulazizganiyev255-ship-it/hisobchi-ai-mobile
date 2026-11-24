import {View, StyleSheet, Text} from 'react-native';
import Svg, {Circle, Defs, Line, LinearGradient as SvgGradient, Path, Stop} from 'react-native-svg';
import {colors} from '../theme/tokens';

function curve(points:{x:number;y:number}[]) {
  return points.reduce((d,p,i)=>{
    if (i===0) return `M ${p.x} ${p.y}`;
    const before=points[i-1];
    const mid=(before.x+p.x)/2;
    return `${d} C ${mid} ${before.y}, ${mid} ${p.y}, ${p.x} ${p.y}`;
  },'');
}

/** Normalized example graph. Financial amounts come from the Finance Engine later. */
export function ExpenseChart({values}:{values:number[]}) {
  const safeValues=values.length>=2?values:[0,0];
  const points=safeValues.map((v,i)=>({
    x:10+i*300/(safeValues.length-1),
    y:119-Math.min(1,Math.max(0,v))*97,
  }));
  const topPoint=points.reduce((best,p)=>p.y<best.y?p:best,points[0]);
  const line=curve(points);
  const area=`${line} L 310 122 L 10 122 Z`;

  return <View style={styles.wrapper}>
    <Svg width="100%" height={141} viewBox="0 0 320 141" preserveAspectRatio="none" accessible={false}>
      <Defs>
        <SvgGradient id="hisobExpenseArea" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={colors.primary} stopOpacity={0.18}/>
          <Stop offset="1" stopColor={colors.primary} stopOpacity={0.01}/>
        </SvgGradient>
      </Defs>
      {[26,58,90,122].map(y=><Line key={y} x1={10} y1={y} x2={310} y2={y} stroke={colors.line} strokeWidth={1} strokeDasharray="5 5"/>)}
      <Path d={area} fill="url(#hisobExpenseArea)"/>
      <Path d={line} stroke={colors.primary} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <Circle cx={topPoint.x} cy={topPoint.y} r={5} fill={colors.primary} stroke={colors.white} strokeWidth={2.5}/>
    </Svg>
    <View style={styles.labels}>
      {['1–7','8–14','15–21','22–oxir'].map(x=><Text style={styles.label} key={x}>{x}</Text>)}
    </View>
    <Text style={styles.note}>Namuna grafik · davr bo‘yicha ko‘rinish</Text>
  </View>;
}

const styles=StyleSheet.create({
  wrapper:{marginTop:12},
  labels:{flexDirection:'row',justifyContent:'space-between',paddingHorizontal:10,marginTop:-2},
  label:{fontSize:10,color:colors.faint},
  note:{fontSize:10,color:colors.muted,textAlign:'center',marginTop:10},
});
