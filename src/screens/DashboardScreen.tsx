import React, {useState} from 'react';
import {Alert, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {AppIcon} from '../components/AppIcon';
import {ExpenseChart} from '../components/ExpenseChart';
import {TransactionRow} from '../components/TransactionRow';
import {demo, formatMoney} from '../data/demo';
import {colors, radius, shadow, spacing} from '../theme/tokens';

export function DashboardScreen({onOpenTransactions}: {onOpenTransactions:()=>void}) {
  const [visible,setVisible] = useState(true);
  const [period,setPeriod] = useState<'current'|'previous'>('current');
  const {width} = useWindowDimensions();
  const narrow = width < 360;
  const month = demo.months[period];

  return <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
    <View style={styles.header}>
      <View style={styles.brandIcon}><AppIcon name="chart" color={colors.primarySoft} size={23}/></View>
      <View style={styles.heading}><Text style={styles.appName}>Hisobchi <Text style={{color:colors.primary}}>AI</Text></Text><Text style={styles.greeting}>Xayrli kun! 👋</Text></View>
      <Pressable style={styles.bell} accessibilityRole="button" accessibilityLabel="Bildirishnomalar" onPress={()=>Alert.alert('Demo rejimi','Bildirishnomalar keyingi bosqichda ulanadi.')}><AppIcon name="bell" color={colors.text} size={20}/></Pressable>
    </View>
    <View style={styles.demoLine}><View style={styles.demoDot}/><Text style={styles.demoText}>DEMO MA’LUMOTLAR · HAQIQIY HISOB EMAS</Text></View>

    <LinearGradient colors={['#164B78','#10385D','#0C2B4B']} start={{x:0,y:0}} end={{x:1,y:1}} style={styles.balanceCard}>
      <View style={styles.balanceWavesA}/><View style={styles.balanceWavesB}/>
      <View style={styles.balanceTop}><View style={styles.balanceTitle}><View style={styles.balanceIcon}><AppIcon name="wallet" color={colors.primarySoft} size={18}/></View><Text style={styles.balanceTitleText}>Umumiy balans</Text></View><Pressable style={styles.eyeBtn} accessibilityRole="button" accessibilityLabel={visible?'Balansni yashirish':'Balansni ko‘rsatish'} onPress={()=>setVisible(s=>!s)}><AppIcon name={visible?'eye':'eye-off'} size={20} color={colors.text}/></Pressable></View>
      <Text style={[styles.balanceValue,narrow&&{fontSize:27}]} adjustsFontSizeToFit numberOfLines={1} minimumFontScale={0.75}>{visible?formatMoney(demo.balance):'••• ••• so‘m'}</Text>
      <Text style={styles.balanceFoot}>Barcha hisoblar bo‘yicha</Text>
    </LinearGradient>

    <Pressable accessibilityRole="button" accessibilityLabel="Xavfsiz sarflash haqida" onPress={()=>Alert.alert('Xavfsiz sarflash','Hozir namuna ko‘rsatilgan. Kelajakda haqiqiy limit rejalashtirilgan to‘lovlar va balansdan hisoblanadi.')}>
      <LinearGradient colors={[colors.cardLight,colors.cardLightBottom]} start={{x:0,y:0}} end={{x:1,y:1}} style={styles.safeCard}>
        <View style={styles.safeIcon}><AppIcon name="shield" size={26} color="#0874B5"/></View>
        <View style={{flex:1,minWidth:0}}><Text style={styles.safeTitle}>Bugun xavfsiz sarflash</Text><Text style={[styles.safeAmount,narrow&&{fontSize:21}]} numberOfLines={1} adjustsFontSizeToFit>{formatMoney(demo.safeToSpendToday)}</Text><Text style={styles.safeSubtitle}>Namuna limit · hali hisoblanmagan</Text></View>
        <AppIcon name="chevron" color={colors.ink} size={19}/>
      </LinearGradient>
    </Pressable>

    <View style={styles.chartCard}>
      <View style={styles.sectionHeader}><View style={styles.sectionTitleRow}><AppIcon name="chart" color={colors.primary} size={19}/><Text style={styles.sectionTitle}>Xarajatlar tahlili</Text></View><Pressable style={styles.periodBtn} accessibilityRole="button" accessibilityLabel="Davrni almashtirish" onPress={()=>setPeriod(x=>x==='current'?'previous':'current')}><Text style={styles.periodText}>{month.label}</Text><AppIcon name="chevron-down" color={colors.text} size={13}/></Pressable></View>
      <Text style={styles.chartAmount}>{formatMoney(month.total)}</Text>
      <Text style={styles.chartDetail}>{period==='current'?'O‘tgan oyga nisbatan': 'Oldingi davrga nisbatan'} · {month.change<0?'−':'+'}{Math.abs(month.change)}%</Text>
      <ExpenseChart values={month.chart}/>
    </View>

    <View style={styles.transactionsCard}>
      <View style={styles.transactionsHeader}><Text style={styles.transactionsTitle}>So‘nggi operatsiyalar</Text><Pressable accessibilityRole="button" accessibilityLabel="Barcha operatsiyalar" onPress={onOpenTransactions} style={styles.arrow}><AppIcon name="chevron" color={colors.ink} size={20}/></Pressable></View>
      {demo.transactions.slice(0,3).map((item,i)=><React.Fragment key={item.id}>{i>0&&<View style={styles.separator}/>}<TransactionRow item={item} light/></React.Fragment>)}
    </View>
    <Text style={styles.disclaimer}>Hisobchi AI · Dizayn prototipi v0.1</Text>
  </ScrollView>;
}

const styles=StyleSheet.create({
  scroll:{flex:1},content:{paddingHorizontal:spacing.lg,paddingTop:18,paddingBottom:28,gap:16},
  header:{flexDirection:'row',gap:12,alignItems:'center'},
  brandIcon:{width:45,height:45,borderRadius:14,backgroundColor:'#125284',alignItems:'center',justifyContent:'center'},
  heading:{flex:1},appName:{fontWeight:'800',fontSize:23,letterSpacing:-0.6,color:colors.text},greeting:{color:colors.muted,fontSize:12,marginTop:3},
  bell:{width:42,height:42,backgroundColor:colors.surface,borderRadius:21,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:colors.divider},
  demoLine:{flexDirection:'row',alignItems:'center',gap:7,marginTop:-7},demoDot:{height:5,width:5,borderRadius:3,backgroundColor:colors.primary},demoText:{fontSize:9,letterSpacing:1,color:colors.faint,fontWeight:'700'},
  balanceCard:{minHeight:166,borderRadius:radius.xl,padding:20,overflow:'hidden',...shadow.card},
  balanceWavesA:{position:'absolute',width:200,height:200,borderRadius:100,backgroundColor:'rgba(64,198,255,0.12)',right:-85,bottom:-130},
  balanceWavesB:{position:'absolute',width:180,height:180,borderRadius:90,backgroundColor:'rgba(153,219,255,0.06)',right:45,top:-130},
  balanceTop:{flexDirection:'row',justifyContent:'space-between',alignItems:'center'},balanceTitle:{flexDirection:'row',alignItems:'center',gap:9},balanceIcon:{width:32,height:32,borderRadius:10,backgroundColor:'rgba(142,219,255,0.12)',alignItems:'center',justifyContent:'center'},balanceTitleText:{color:colors.text,fontSize:15,fontWeight:'600'},eyeBtn:{padding:8,margin:-8},
  balanceValue:{color:'#FFFFFF',fontWeight:'800',fontSize:32,letterSpacing:-0.8,marginTop:19},balanceFoot:{color:'#B2D1E5',fontSize:11,marginTop:8},
  safeCard:{borderRadius:radius.lg,padding:16,minHeight:108,flexDirection:'row',alignItems:'center',gap:12,...shadow.light},safeIcon:{height:47,width:47,backgroundColor:'#C7EFFF',borderRadius:15,alignItems:'center',justifyContent:'center'},safeTitle:{color:colors.ink,fontWeight:'600',fontSize:12},safeAmount:{color:colors.ink,fontWeight:'800',fontSize:24,letterSpacing:-0.5,marginTop:5},safeSubtitle:{color:'#547C9C',fontSize:10,marginTop:4},
  chartCard:{borderRadius:radius.lg,backgroundColor:colors.surface,padding:18,borderWidth:1,borderColor:'rgba(124,197,235,0.13)'},
  sectionHeader:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',gap:8},sectionTitleRow:{flexDirection:'row',alignItems:'center',gap:9,flexShrink:1},sectionTitle:{color:colors.text,fontWeight:'700',fontSize:16},periodBtn:{backgroundColor:colors.surfaceRaised,borderRadius:radius.pill,paddingVertical:9,paddingHorizontal:11,flexDirection:'row',alignItems:'center',gap:6},periodText:{color:colors.text,fontSize:11,fontWeight:'600'},chartAmount:{fontWeight:'700',fontSize:20,color:colors.text,marginTop:13},chartDetail:{fontSize:11,color:colors.muted,marginTop:4},
  transactionsCard:{backgroundColor:colors.cardLight,borderRadius:radius.lg,paddingHorizontal:16,paddingVertical:12},transactionsHeader:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:7},transactionsTitle:{color:colors.ink,fontWeight:'800',fontSize:17,letterSpacing:-0.4},arrow:{width:32,height:32,borderRadius:16,backgroundColor:'rgba(255,255,255,0.65)',justifyContent:'center',alignItems:'center'},separator:{height:1,backgroundColor:'#D1E4F0',marginLeft:57},
  disclaimer:{color:colors.faint,textAlign:'center',fontSize:10,marginTop:1}
});
