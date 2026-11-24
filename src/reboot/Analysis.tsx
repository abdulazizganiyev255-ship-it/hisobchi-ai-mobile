import {useState} from 'react';
import {ScrollView,StyleSheet,Text,View,type DimensionValue} from 'react-native';
import {formatMoney,type Transaction} from '../data/demo';
import {calculateAnalytics,analyticsRangeLabel} from '../data/analytics';
import {todayLocal} from '../data/transactions';
import {T} from './theme';
import {Eyebrow,FilterPill,Header,SampleFlag,SectionHead} from './UI';
import {FlowPlot} from './FlowPlot';

type Props={items:Transaction[];onActivity:()=>void};

export function Analysis({items,onActivity}:Props){
  const [period,setPeriod]=useState<'all'|'month'>('all');
  const report=calculateAnalytics(items,period,todayLocal());
  return <ScrollView testID="reboot-insights" style={s.root} contentContainerStyle={s.content}>
    <Header section="MOLIYAVIY TAHLIL"/><SampleFlag/>
    <View style={s.intro}><Eyebrow>03 / 04  —  TAHLIL MARKAZI</Eyebrow>
      <Text style={s.heading}>Ko‘rinadigan haqiqat.</Text>
      <Text style={s.subtitle}>Har bir raqam operatsiya dalillariga tayanadi. Hech qanday taxminiy balans yo‘q.</Text></View>
    <View style={s.filters}>
      <FilterPill title="Barcha qaydlar" active={period==='all'} onPress={()=>setPeriod('all')}
        testID="reboot-analysis-all"/>
      <FilterPill title="Bu oy" active={period==='month'} onPress={()=>setPeriod('month')}
        testID="reboot-analysis-month"/>
    </View>
    <Text style={s.period}>{analyticsRangeLabel(report)} · {report.transactionsCount} yozuv</Text>

    <View style={s.netPanel}>
      <Eyebrow light>KIRIM − CHIQIM · BANK BALANSI EMAS</Eyebrow>
      <Text testID="reboot-analysis-net" style={s.netAmount} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={.7}>
        {formatMoney(report.net)}
      </Text>
      <View style={s.netFoot}><View style={s.netDecor}/>
        <Text style={s.netFootText}>SESSIYA YAKUNI · HISOBLANGAN</Text></View>
    </View>
    <View style={s.metrics}>
      <View style={s.metric}><Text style={s.metricLabel}>KIRIM</Text>
        <Text style={s.metricValue} numberOfLines={1} adjustsFontSizeToFit>{formatMoney(report.income)}</Text></View>
      <View style={[s.metric,{borderLeftWidth:1,borderLeftColor:T.border}]}>
        <Text style={s.metricLabel}>CHIQIM</Text>
        <Text style={s.metricValue} numberOfLines={1} adjustsFontSizeToFit>{formatMoney(report.expense)}</Text></View>
    </View>

    <View style={s.section}><SectionHead title="Xarajat dinamikasi" note="KUNLAR BO‘YICHA"/>
      <View style={s.plot}><FlowPlot days={report.days}/>
        <Text style={s.plotNote}>Kunlar — qayd sanalari. Bo‘sh davr uchun taxminiy egri chiziq chizilmaydi.</Text></View></View>

    <View style={s.section}><SectionHead title="Xarajat tuzilishi" note="KATEGORIYALAR"
      action="Faoliyat" onAction={onActivity}/>
      {report.categories.length?report.categories.map((c,i)=>
        <View key={c.name} style={s.category}>
          <View style={s.categoryHead}>
            <Text style={s.categoryNum}>{String(i+1).padStart(2,'0')}</Text>
            <Text style={s.categoryTitle} numberOfLines={1}>{c.name}</Text>
            <Text style={s.categoryAmount}>{formatMoney(c.amount)}</Text>
          </View>
          <View style={s.track}><View style={[s.bar,{width:(String(Math.min(100,Math.max(0,c.percent)))+'%') as DimensionValue}]}/></View>
          <Text style={s.categoryPercent}>{c.percent}% · qayd etilgan xarajatlardan</Text>
        </View>
      ):<Text style={s.empty}>Bu davrda xarajat yozuvlari mavjud emas.</Text>}
    </View>

    <View style={s.aiNotice}>
      <Text style={s.aiLabel}>AI · O‘CHIRILGAN</Text>
      <Text style={s.aiTitle}>Dalil bor. Sun’iy xulosa yo‘q.</Text>
      <Text style={s.aiText}>AI API ulanmaguncha avtomatik tavsiya chiqarmaymiz. Ushbu ekrandagi qiymatlar deterministik hisoblanadi.</Text>
    </View>
  </ScrollView>;
}
const s=StyleSheet.create({
  root:{flex:1,backgroundColor:T.canvas},content:{paddingHorizontal:18,paddingTop:7,paddingBottom:45},
  intro:{marginTop:25},heading:{fontSize:29,fontWeight:'900',letterSpacing:-1.4,color:T.ink,marginTop:9},
  subtitle:{fontSize:13,color:T.muted,lineHeight:20,marginTop:8},
  filters:{flexDirection:'row',gap:8,marginTop:19},
  period:{fontSize:11,color:T.muted,marginTop:10},
  netPanel:{marginTop:17,borderRadius:15,padding:18,backgroundColor:T.strip},
  netAmount:{fontSize:30,fontWeight:'900',letterSpacing:-1,color:T.white,marginTop:17},
  netFoot:{flexDirection:'row',alignItems:'center',gap:9,marginTop:15},
  netDecor:{width:32,height:6,backgroundColor:'#9DB1FF',borderRadius:2},
  netFootText:{fontSize:9,fontWeight:'800',letterSpacing:.8,color:'#CED9EC'},
  metrics:{flexDirection:'row',paddingVertical:17,borderBottomWidth:1,borderColor:T.border},
  metric:{flex:1,minWidth:0,paddingHorizontal:10,gap:7},
  metricLabel:{fontSize:10,fontWeight:'900',letterSpacing:1.1,color:T.muted},
  metricValue:{fontSize:17,fontWeight:'900',color:T.ink},
  section:{marginTop:26},
  plot:{backgroundColor:T.paper,borderWidth:1,borderColor:T.border,borderRadius:14,padding:13},
  plotNote:{color:T.muted,fontSize:10,lineHeight:17,marginTop:10},
  category:{borderBottomWidth:1,borderBottomColor:T.border,paddingVertical:14},
  categoryHead:{flexDirection:'row',alignItems:'center',gap:10},
  categoryNum:{fontSize:11,fontWeight:'900',color:T.cobalt},
  categoryTitle:{flex:1,minWidth:0,fontSize:13,color:T.ink,fontWeight:'800'},
  categoryAmount:{fontSize:12,color:T.ink,fontWeight:'800'},
  track:{height:5,backgroundColor:T.pale,overflow:'hidden',marginTop:11,borderRadius:3},
  bar:{height:5,backgroundColor:T.cobalt,borderRadius:3},
  categoryPercent:{fontSize:10,color:T.muted,marginTop:7},
  empty:{fontSize:12,color:T.muted,marginTop:14},
  aiNotice:{marginTop:26,padding:18,backgroundColor:T.cobaltWash,borderRadius:13,borderColor:'#D6DEFA',borderWidth:1},
  aiLabel:{fontSize:10,fontWeight:'900',color:T.cobalt,letterSpacing:1.1},
  aiTitle:{fontSize:16,fontWeight:'800',color:T.ink,marginTop:9},
  aiText:{fontSize:12,color:T.secondary,lineHeight:20,marginTop:7},
});
