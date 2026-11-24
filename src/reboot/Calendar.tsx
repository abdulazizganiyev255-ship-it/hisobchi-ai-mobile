import {useState} from 'react';
import {Modal,Pressable,StyleSheet,Text,View} from 'react-native';
import {AppIcon} from '../components/AppIcon';
import {todayLocal} from '../data/transactions';
import {T} from './theme';
import {Eyebrow} from './UI';

type Props={value:string;onSelect:(iso:string)=>void;onClose:()=>void};
const MONTHS=['Yanvar','Fevral','Mart','Aprel','May','Iyun','Iyul','Avgust','Sentabr','Oktabr','Noyabr','Dekabr'];
const WEEK=['Du','Se','Cho','Pa','Ju','Sha','Ya'];

export function Calendar({value,onSelect,onClose}:Props){
  const [year,setYear]=useState(()=>Number(value.slice(0,4)));
  const [month,setMonth]=useState(()=>Number(value.slice(5,7))-1);
  const today=todayLocal(),currentMonth=today.slice(0,7);
  const offset=(new Date(Date.UTC(year,month,1)).getUTCDay()+6)%7;
  const days=new Date(Date.UTC(year,month+1,0)).getUTCDate();
  const cellCount=Math.ceil((offset+days)/7)*7;
  const move=(delta:number)=>{
    const shifted=new Date(Date.UTC(year,month+delta,1));
    setYear(shifted.getUTCFullYear());setMonth(shifted.getUTCMonth());
  };
  const visibleMonth=String(year)+'-'+String(month+1).padStart(2,'0');
  const canForward=visibleMonth<currentMonth;
  return <Modal transparent animationType="fade" visible onRequestClose={onClose}>
    <View style={s.backdrop}><View style={s.panel} testID="reboot-calendar">
      <Eyebrow>OPERATSIYA SANASI</Eyebrow>
      <View style={s.monthHeader}>
        <Pressable accessibilityRole="button" accessibilityLabel="Oldingi oy"
          style={s.arrow} onPress={()=>move(-1)}><AppIcon name="arrow-left" color={T.ink} size={19}/></Pressable>
        <Text style={s.monthName}>{MONTHS[month]} {year}</Text>
        <Pressable accessibilityRole="button" accessibilityLabel="Keyingi oy"
          disabled={!canForward} style={[s.arrow,!canForward&&{opacity:0.35}]}
          onPress={()=>move(1)}><AppIcon name="chevron" color={T.ink} size={20}/></Pressable>
      </View>
      <View style={s.week}>{WEEK.map(w=><Text key={w} style={s.weekLabel}>{w}</Text>)}</View>
      <View style={s.grid}>
        {Array.from({length:cellCount},(_,i)=>{
          const day=i-offset+1;
          if(day<1||day>days)return <View key={'blank-'+i} style={s.day}/>;
          const iso=visibleMonth+'-'+String(day).padStart(2,'0');
          const disabled=iso>today,selected=iso===value;
          return <Pressable key={iso} testID={'reboot-calendar-day-'+day}
            accessibilityRole="button" accessibilityLabel={iso}
            accessibilityState={{selected,disabled}} disabled={disabled}
            style={[s.day,selected&&s.dayActive,disabled&&s.dayDisabled]}
            onPress={()=>onSelect(iso)}>
            <Text style={[s.dayText,selected&&s.dayTextActive]}>{day}</Text>
          </Pressable>;
        })}
      </View>
      <View style={s.bottom}>
        <Pressable accessibilityRole="button" style={s.todayBtn} onPress={()=>onSelect(today)}>
          <Text style={s.todayText}>Bugun</Text></Pressable>
        <Pressable accessibilityRole="button" style={s.cancelBtn} onPress={onClose}>
          <Text style={s.cancelText}>Bekor qilish</Text></Pressable>
      </View>
    </View></View>
  </Modal>;
}
const s=StyleSheet.create({
  backdrop:{flex:1,backgroundColor:'rgba(16,24,36,0.62)',justifyContent:'center',paddingHorizontal:5},
  panel:{width:'100%',paddingHorizontal:5,paddingVertical:21,borderRadius:14,backgroundColor:T.paper},
  monthHeader:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:17,marginBottom:13},
  monthName:{fontSize:17,fontWeight:'900',color:T.ink},
  arrow:{width:44,height:44,alignItems:'center',justifyContent:'center'},
  week:{flexDirection:'row'},
  weekLabel:{width:'14.2857%',textAlign:'center',fontSize:10,fontWeight:'800',color:T.muted,paddingBottom:8},
  grid:{flexDirection:'row',flexWrap:'wrap'},
  day:{width:'14.2857%',minHeight:44,justifyContent:'center',alignItems:'center',borderRadius:10},
  dayActive:{backgroundColor:T.cobalt},
  dayDisabled:{opacity:.32},
  dayText:{fontSize:13,fontWeight:'700',color:T.ink},
  dayTextActive:{color:T.white,fontWeight:'900'},
  bottom:{flexDirection:'row',gap:9,marginTop:16},
  todayBtn:{minHeight:45,flex:1,backgroundColor:T.cobaltWash,borderRadius:10,alignItems:'center',justifyContent:'center'},
  todayText:{fontWeight:'800',color:T.cobalt,fontSize:13},
  cancelBtn:{minHeight:45,flex:1,backgroundColor:T.canvas,borderRadius:10,alignItems:'center',justifyContent:'center'},
  cancelText:{fontWeight:'700',color:T.secondary,fontSize:13},
});
