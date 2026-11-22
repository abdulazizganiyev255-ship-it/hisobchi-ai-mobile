import React, {useState} from 'react';
import {Alert, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {AppIcon} from '../components/AppIcon';
import {ExpenseChart} from '../components/ExpenseChart';
import {TransactionRow} from '../components/TransactionRow';
import {SectionHeader} from '../components/ds/SectionHeader';
import {SurfaceCard} from '../components/ds/SurfaceCard';
import {demo, formatMoney, type Transaction} from '../data/demo';
import {filterAndSortTransactions} from '../data/transactions';
import {colors, radius, shadow, spacing} from '../theme/tokens';

export function DashboardScreen({onOpenTransactions, transactions}: {onOpenTransactions:()=>void; transactions:Transaction[]}) {
  const [visible,setVisible] = useState(true);
  const [period,setPeriod] = useState<'current'|'previous'>('current');
  const {width} = useWindowDimensions();
  const narrow = width < 375;
  const month = demo.months[period];
  const improved = month.change < 0;
  const recent = filterAndSortTransactions(transactions, 'all', '').slice(0, 3);

  return <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
    <View style={styles.header}>
      <LinearGradient colors={['#1B73AA','#0A4775']} start={{x:0,y:0}} end={{x:1,y:1}} style={styles.brandIcon}><AppIcon name="chart" color="#C4F2FF" size={23} strokeWidth={2.1}/></LinearGradient>
      <View style={styles.heading}><Text style={styles.appName}>Hisobchi <Text style={{color:colors.primary}}>AI</Text></Text><Text style={styles.greeting}>Xayrli kun! 👋</Text></View>
      <Pressable style={styles.bell} accessibilityRole="button" accessibilityLabel="Bildirishnomalar" onPress={()=>Alert.alert('Demo rejimi','Bildirishnomalar keyingi bosqichda ulanadi.')}><AppIcon name="bell" color={colors.text} size={20}/></Pressable>
    </View>
    <View style={styles.demoLine}><View style={styles.demoDot}/><Text style={styles.demoText}>DEMO MA’LUMOTLAR · HAQIQIY HISOB EMAS</Text></View>

    <LinearGradient colors={['#205C87','#123C61','#092D4C']} start={{x:0,y:0}} end={{x:1,y:1}} style={styles.balanceCard}>
      <View style={styles.balanceWavesA}/><View style={styles.balanceWavesB}/>
      <View style={styles.balanceTop}><View style={styles.balanceTitle}><View style={styles.balanceIcon}><AppIcon name="wallet" color={colors.primarySoft} size={18}/></View><Text style={styles.balanceTitleText}>Umumiy balans</Text></View><Pressable style={styles.eyeBtn} accessibilityRole="button" accessibilityLabel={visible?'Balansni yashirish':'Balansni ko‘rsatish'} onPress={()=>setVisible(s=>!s)}><AppIcon name={visible?'eye':'eye-off'} size={20} color={colors.text}/></Pressable></View>
      <Text style={[styles.balanceValue,narrow&&{fontSize:27}]} adjustsFontSizeToFit numberOfLines={1} minimumFontScale={0.75}>{visible?formatMoney(demo.balance):'••• ••• so‘m'}</Text>
      <View style={styles.balanceBottom}><Text style={styles.balanceFoot}>Barcha hisoblar bo‘yicha</Text><View style={styles.balanceBadge}><View style={styles.balanceBadgeDot}/><Text style={styles.balanceBadgeText}>Namuna</Text></View></View>
    </LinearGradient>

    <Pressable accessibilityRole="button" accessibilityLabel="Xavfsiz sarflash haqida" onPress={()=>Alert.alert('Xavfsiz sarflash','Hozir namuna ko‘rsatilgan. Kelajakda haqiqiy limit rejalashtirilgan to‘lovlar va balansdan hisoblanadi.')}>
      <LinearGradient colors={['#F0FAFF','#CDEEFF','#B4E5F7']} start={{x:0,y:0}} end={{x:1,y:1}} style={styles.safeCard}>
        <View style={styles.safeIcon}><AppIcon name="shield" size={26} color="#0874B5"/></View>
        <View style={{flex:1,minWidth:0}}><Text style={styles.safeTitle}>Bugun xavfsiz sarflash</Text><Text style={[styles.safeAmount,narrow&&{fontSize:21}]} numberOfLines={1} adjustsFontSizeToFit>{formatMoney(demo.safeToSpendToday)}</Text><Text style={styles.safeSubtitle}>Namuna limit · hali hisoblanmagan</Text></View>
        <View style={styles.safeArrow}><AppIcon name="chevron" color={colors.ink} size={19}/></View>
      </LinearGradient>
    </Pressable>

    <SurfaceCard style={styles.chartCard}>
      <SectionHeader
        icon="chart"
        title="Xarajatlar tahlili"
        trailing={
          <Pressable
            style={styles.periodBtn}
            accessibilityRole="button"
            accessibilityLabel={`Davr: ${month.label}. Almashtirish`}
            onPress={() => setPeriod(x => x === 'current' ? 'previous' : 'current')}
          >
            <Text style={styles.periodText}>{month.label}</Text>
            <AppIcon name="chevron-down" color={colors.primarySoft} size={13}/>
          </Pressable>
        }
      />
      <View style={styles.chartSummary}><View style={styles.chartMain}><Text style={styles.chartEyebrow}>JAMI XARAJAT · DEMO</Text><Text style={styles.chartAmount} numberOfLines={1} adjustsFontSizeToFit>{formatMoney(month.total)}</Text></View><View style={[styles.changePill,improved?styles.changeGood:styles.changeBad]}><Text style={[styles.changeText,improved?styles.changeGoodText:styles.changeBadText]}>{month.change<0?'−':'+'}{Math.abs(month.change)}%</Text></View></View>
      <Text style={styles.chartDetail}>{period==='current'?'O‘tgan oyga nisbatan':'Oldingi davrga nisbatan'}</Text>
      <ExpenseChart values={month.chart}/>
      <View style={styles.chartFooter}><View style={styles.legendDot}/><Text style={styles.legendText}>Mustaqil demo grafik · operatsiyalardan hisoblanmagan</Text></View>
    </SurfaceCard>

    <SurfaceCard tone="light" style={styles.transactionsCard}>
      <View style={styles.transactionsHeader}>
        <SectionHeader
          icon="receipt"
          title="So‘nggi operatsiyalar"
          subtitle={recent.length + ' ta yozuv · demo sessiya'}
          tone="light"
          trailing={
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Barcha operatsiyalar"
              onPress={onOpenTransactions}
              style={styles.arrow}
            >
              <AppIcon name="chevron" color={colors.ink} size={20}/>
            </Pressable>
          }
        />
      </View>
      {recent.length ? recent.map((item,i)=><React.Fragment key={item.id}>{i>0&&<View style={styles.separator}/>}<TransactionRow item={item} light/></React.Fragment>) : <Text style={styles.emptyTransactions}>Operatsiya mavjud emas</Text>}
    </SurfaceCard>
    <Text style={styles.disclaimer}>Hisobchi AI · DS v1.1 · Balans va oylik grafik mustaqil demo qiymatlar</Text>
  </ScrollView>;
}

const styles=StyleSheet.create({
  scroll:{flex:1},content:{paddingHorizontal:spacing.lg,paddingTop:16,paddingBottom:28,gap:15},
  header:{flexDirection:'row',gap:12,alignItems:'center'},
  brandIcon:{width:46,height:46,borderRadius:15,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:'rgba(165,231,255,0.17)'},
  heading:{flex:1},appName:{fontWeight:'800',fontSize:23,letterSpacing:-0.6,color:colors.text},greeting:{color:colors.muted,fontSize:12,marginTop:3},
  bell:{width:44,height:44,backgroundColor:'#102F4D',borderRadius:22,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:'rgba(171,228,255,0.16)'},
  demoLine:{flexDirection:'row',alignItems:'center',gap:7,marginTop:-7},demoDot:{height:5,width:5,borderRadius:3,backgroundColor:colors.primary},demoText:{fontSize:9,letterSpacing:1,color:colors.faint,fontWeight:'700'},
  balanceCard:{minHeight:158,borderRadius:radius.xl,padding:20,overflow:'hidden',borderWidth:1,borderColor:'rgba(147,220,255,0.14)',...shadow.card},
  balanceWavesA:{position:'absolute',width:200,height:200,borderRadius:100,backgroundColor:'rgba(64,198,255,0.12)',right:-85,bottom:-130},
  balanceWavesB:{position:'absolute',width:180,height:180,borderRadius:90,backgroundColor:'rgba(153,219,255,0.06)',right:45,top:-130},
  balanceTop:{flexDirection:'row',justifyContent:'space-between',alignItems:'center'},balanceTitle:{flexDirection:'row',alignItems:'center',gap:9},balanceIcon:{width:32,height:32,borderRadius:10,backgroundColor:'rgba(142,219,255,0.12)',alignItems:'center',justifyContent:'center'},balanceTitleText:{color:colors.text,fontSize:15,fontWeight:'600'},eyeBtn:{minWidth:44,minHeight:44,alignItems:'center',justifyContent:'center'},
  balanceValue:{color:'#FFFFFF',fontWeight:'800',fontSize:31,letterSpacing:-0.75,marginTop:19},balanceBottom:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:8,marginTop:9},balanceFoot:{color:'#B5D5E8',fontSize:11,flexShrink:1},balanceBadge:{flexDirection:'row',alignItems:'center',gap:5,borderRadius:999,paddingHorizontal:9,paddingVertical:5,backgroundColor:'rgba(218,245,255,0.11)'},balanceBadgeDot:{height:5,width:5,borderRadius:3,backgroundColor:colors.primary},balanceBadgeText:{color:'#D2EDFA',fontSize:10,fontWeight:'600'},
  safeCard:{borderRadius:radius.lg,padding:16,minHeight:108,flexDirection:'row',alignItems:'center',gap:12,overflow:'hidden',...shadow.light},safeArrow:{height:32,width:32,borderRadius:16,backgroundColor:'rgba(255,255,255,0.48)',alignItems:'center',justifyContent:'center'},safeIcon:{height:47,width:47,backgroundColor:'#C7EFFF',borderRadius:15,alignItems:'center',justifyContent:'center'},safeTitle:{color:colors.ink,fontWeight:'600',fontSize:12},safeAmount:{color:colors.ink,fontWeight:'800',fontSize:24,letterSpacing:-0.5,marginTop:5},safeSubtitle:{color:'#547C9C',fontSize:10,marginTop:4},
  chartCard:{borderRadius:radius.lg,backgroundColor:colors.surface,paddingHorizontal:17,paddingTop:16,paddingBottom:14,borderWidth:1,borderColor:'rgba(156,219,250,0.14)'},
  sectionHeader:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',gap:8},sectionTitleRow:{flexDirection:'row',alignItems:'center',gap:9,flexShrink:1},sectionIcon:{height:31,width:31,borderRadius:10,backgroundColor:'#163C5D',alignItems:'center',justifyContent:'center'},sectionTitle:{color:colors.text,fontWeight:'700',fontSize:15},periodBtn:{backgroundColor:colors.surfaceRaised,borderRadius:radius.pill,minHeight:44,paddingVertical:8,paddingHorizontal:12,flexDirection:'row',alignItems:'center',gap:6},periodText:{color:colors.text,fontSize:11,fontWeight:'600'},chartSummary:{flexDirection:'row',alignItems:'flex-end',gap:8,marginTop:15},chartMain:{flex:1,minWidth:0},chartEyebrow:{color:colors.faint,fontSize:9,letterSpacing:0.7,fontWeight:'700'},chartAmount:{fontWeight:'800',fontSize:22,color:colors.text,marginTop:5},chartDetail:{fontSize:11,color:colors.muted,marginTop:4},changePill:{borderRadius:999,paddingHorizontal:10,paddingVertical:6,marginBottom:1},changeGood:{backgroundColor:'rgba(49,195,150,0.12)'},changeBad:{backgroundColor:'rgba(245,155,155,0.13)'},changeText:{fontSize:11,fontWeight:'800'},changeGoodText:{color:'#6FE4BC'},changeBadText:{color:'#FFACAC'},chartFooter:{borderTopWidth:1,borderColor:colors.divider,flexDirection:'row',alignItems:'center',gap:7,marginTop:8,paddingTop:10},legendDot:{height:6,width:6,borderRadius:3,backgroundColor:colors.primary},legendText:{fontSize:10,color:colors.faint},
  transactionsCard:{backgroundColor:colors.cardLight,borderRadius:radius.lg,paddingHorizontal:16,paddingVertical:12},transactionsHeader:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:8,marginBottom:10},transactionsHeading:{flex:1,minWidth:0},transactionsTitle:{color:colors.ink,fontWeight:'800',fontSize:16,letterSpacing:-0.25},transactionsCaption:{color:'#62839B',fontSize:10,marginTop:4},arrow:{width:44,height:44,borderRadius:22,backgroundColor:'#FFFFFF',justifyContent:'center',alignItems:'center'},separator:{height:1,backgroundColor:'#D1E4F0',marginLeft:57},emptyTransactions:{color:'#68859A',fontSize:12,textAlign:'center',padding:22},
  disclaimer:{color:colors.faint,textAlign:'center',fontSize:10,marginTop:1}
});
