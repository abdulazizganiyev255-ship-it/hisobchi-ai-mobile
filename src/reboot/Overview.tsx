import {Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions} from 'react-native';
import {AppIcon} from '../components/AppIcon';
import {formatMoney, type Transaction} from '../data/demo';
import {T} from './theme';
import {ActionButton, Eyebrow, Header, SampleFlag, SectionHead, TransactionLine} from './UI';
import {FlowPlot} from './FlowPlot';
import {recentRecords, sessionReport} from './finance';

type Props={items:Transaction[];onExpense:()=>void;onIncome:()=>void;onActivity:()=>void;onEdit:(item:Transaction)=>void;onSafeInfo:()=>void};

export function Overview({items,onExpense,onIncome,onActivity,onEdit,onSafeInfo}:Props) {
  const report=sessionReport(items), recent=recentRecords(items);
  const compact=useWindowDimensions().width<365;
  return (
    <ScrollView testID="reboot-home" style={s.root} contentContainerStyle={s.content}>
      <Header/>
      <View style={s.rule}/>
      <SampleFlag/>
      <View style={s.hero} testID="reboot-hero">
        <View style={s.overline}><Eyebrow>01 / 04  —  MOLIYAVIY KO‘RINISH</Eyebrow><Text style={s.serial}>PUL IZI®</Text></View>
        <Text style={s.caption}>Qaydlar bo‘yicha farq</Text>
        <View style={s.figureRow}>
          <Text testID="reboot-net" style={[s.figure,compact&&{fontSize:37}]}
            numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.75}>
            {formatMoney(report.net).replace(/ so‘m$/,'')}
          </Text>
          <View style={s.figureMark}><View style={s.markTall}/><View style={s.markDot}/></View>
        </View>
        <Text style={s.unit}>SO‘M <Text style={s.factual}>· Kirim − chiqim, bank balansi emas</Text></Text>
      </View>

      <View style={s.metrics}>
        <View style={s.metric}><Text style={s.metricKicker}><Text style={{color:T.positive}}>■ </Text>KIRIM</Text>
          <Text testID="reboot-income" style={s.metricValue} numberOfLines={1} adjustsFontSizeToFit>{formatMoney(report.income)}</Text>
          <Text style={s.metricCaption}>Qayd etilgan tushum</Text></View>
        <View style={s.divider}/>
        <View style={s.metric}><Text style={s.metricKicker}><Text style={{color:T.coral}}>■ </Text>CHIQIM</Text>
          <Text testID="reboot-expense" style={s.metricValue} numberOfLines={1} adjustsFontSizeToFit>{formatMoney(report.expense)}</Text>
          <Text style={s.metricCaption}>Qayd etilgan sarf</Text></View>
      </View>

      <View style={s.actionHead}><Eyebrow>TEZKOR AMALLAR</Eyebrow><Text style={s.actionNote}>Bir yozuv · aniq nazorat</Text></View>
      <View style={s.actionRow}>
        <View style={{flex:1}}><ActionButton title="Xarajat" onPress={onExpense} testID="reboot-add-expense"/></View>
        <View style={{flex:1}}><ActionButton title="Daromad" secondary onPress={onIncome} testID="reboot-add-income"/></View>
      </View>

      <Pressable testID="reboot-safe-info" accessibilityRole="button"
        accessibilityLabel="Xavfsiz sarflash holati haqida" onPress={onSafeInfo} style={s.safe}>
        <View style={s.safeIcon}><AppIcon name="shield" size={20} color={T.cobalt}/></View>
        <View style={{flex:1,minWidth:0}}><Text style={s.safeTitle}>Bugun xavfsiz sarflash</Text>
          <Text style={s.safeDetail}>Hisoblar ulanmaguncha hisoblanmaydi</Text></View>
        <AppIcon name="chevron" color={T.cobalt} size={18}/>
      </Pressable>

      <View style={s.section}><SectionHead title="Xarajatlar izi" note="SESSIYA YOZUVLARI"/>
        <View style={s.chartPanel}>
          <View style={s.plotHead}><Eyebrow>QAYD ETILGAN KUNLAR</Eyebrow>
            <Text style={s.plotCount}>{report.days.length} KUN</Text></View>
          <FlowPlot days={report.days}/>
          <Text style={s.plotNote}>Grafik faqat kiritilgan operatsiyalarni ifodalaydi. Bashorat emas.</Text>
        </View>
      </View>

      <View style={s.section}><SectionHead title="Oxirgi yozuvlar" note="OPERATSIYALAR" action="Barchasi" onAction={onActivity}/>
        <View style={s.list}>{recent.length?recent.map(x=>
          <TransactionLine key={x.id} item={x} onPress={()=>onEdit(x)}/>):
          <Text style={s.empty}>Yozuv yo‘q. Yuqoridan birinchi operatsiyani qo‘shing.</Text>}</View>
      </View>
      <Text style={s.foot}>NAMUNA · ILAVA YOPILGANDA SESSIYA MA’LUMOTLARI SAQLANMAYDI</Text>
    </ScrollView>
  );
}

const s=StyleSheet.create({
  root:{flex:1,backgroundColor:T.canvas},content:{paddingHorizontal:18,paddingTop:7,paddingBottom:40},
  rule:{height:1,backgroundColor:T.border,marginTop:4,marginBottom:11},
  hero:{paddingTop:23,paddingBottom:17},
  overline:{flexDirection:'row',justifyContent:'space-between',alignItems:'center'},
  serial:{color:T.cobalt,fontSize:10,fontWeight:'900',letterSpacing:.8},
  caption:{fontSize:17,fontWeight:'600',color:T.secondary,marginTop:15},
  figureRow:{flexDirection:'row',alignItems:'center',gap:7,marginTop:3},
  figure:{flex:1,minWidth:0,fontSize:45,fontWeight:'900',letterSpacing:-2.1,color:T.ink,includeFontPadding:false},
  figureMark:{height:45,width:14,alignItems:'flex-end',justifyContent:'space-between'},
  markTall:{height:28,width:11,borderRadius:2,backgroundColor:T.cobalt},
  markDot:{height:7,width:7,borderRadius:2,backgroundColor:T.cobalt},
  unit:{color:T.cobalt,fontWeight:'900',fontSize:12,letterSpacing:.5,marginTop:6},
  factual:{fontSize:10,fontWeight:'600',color:T.muted,letterSpacing:0},
  metrics:{flexDirection:'row',borderTopWidth:1,borderBottomWidth:1,borderColor:T.border,paddingVertical:15,gap:12},
  metric:{flex:1,minWidth:0},
  metricKicker:{fontSize:10,fontWeight:'900',letterSpacing:1.1,color:T.muted},
  metricValue:{fontSize:18,fontWeight:'900',color:T.ink,marginTop:8,letterSpacing:-.5},
  metricCaption:{fontSize:10,color:T.muted,marginTop:4},
  divider:{width:1,backgroundColor:T.border},
  actionHead:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:18,marginBottom:9},
  actionNote:{fontSize:10,color:T.muted},
  actionRow:{flexDirection:'row',gap:8},
  safe:{minHeight:70,backgroundColor:T.paper,marginTop:13,borderWidth:1,borderColor:T.border,borderRadius:12,
    padding:11,flexDirection:'row',alignItems:'center',gap:9},
  safeIcon:{width:40,height:40,borderRadius:10,backgroundColor:T.cobaltWash,alignItems:'center',justifyContent:'center'},
  safeTitle:{fontSize:13,fontWeight:'800',color:T.ink},
  safeDetail:{fontSize:10,color:T.muted,marginTop:4,lineHeight:15},
  section:{marginTop:25},
  chartPanel:{backgroundColor:T.paper,borderWidth:1,borderColor:T.border,borderRadius:14,paddingHorizontal:13,paddingTop:12,paddingBottom:13},
  plotHead:{flexDirection:'row',justifyContent:'space-between',alignItems:'center'},
  plotCount:{fontSize:9,fontWeight:'800',color:T.cobalt,letterSpacing:.6},
  plotNote:{fontSize:10,color:T.muted,marginTop:9,lineHeight:15},
  list:{borderWidth:1,borderColor:T.border,borderRadius:13,backgroundColor:T.paper,paddingHorizontal:12},
  empty:{fontSize:12,paddingVertical:20,color:T.muted},
  foot:{color:T.muted,fontSize:9,fontWeight:'800',letterSpacing:.45,marginTop:24},
});
