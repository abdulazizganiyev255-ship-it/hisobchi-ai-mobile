import {useEffect,useState} from 'react';
import {Modal,Pressable,StyleSheet,Text,View} from 'react-native';
import {AppIcon} from './AppIcon';
import {colors,radius,spacing,shadow} from '../theme/tokens';
import {monthCells,monthTitle,shiftMonth} from '../data/calendar';

const DAY_LABELS=['Du','Se','Cho','Pa','Ju','Sha','Ya'];

type Props={
  visible:boolean;
  value:string;
  todayISO:string;
  onClose:()=>void;
  onSelect:(iso:string)=>void;
};

export function CalendarSheet({visible,value,todayISO,onClose,onSelect}:Props) {
  const [month,setMonth]=useState(value.slice(0,7));

  useEffect(()=>{
    if(visible)setMonth(value.slice(0,7));
  },[value,visible]);

  const cells=monthCells(month);
  const canNext=month<todayISO.slice(0,7);
  const canPrevious=month>'1900-01';

  const select=(iso:string)=>{
    if(iso>todayISO)return;
    onSelect(iso);
  };

  return <Modal
    visible={visible}
    transparent
    animationType="slide"
    onRequestClose={onClose}
    accessibilityViewIsModal
  >
    <View style={styles.overlay}>
      <Pressable
        style={StyleSheet.absoluteFill}
        accessibilityRole="button"
        accessibilityLabel="Kalendarni yopish"
        onPress={onClose}
      />
      <View style={styles.sheet}>
        <View style={styles.grabber}/>
        <View style={styles.heading}>
          <View style={{flex:1}}>
            <Text style={styles.eyebrow}>SANA TANLASH</Text>
            <Text style={styles.title}>Qachon bo‘lgan?</Text>
          </View>
          <Pressable style={styles.close} accessibilityRole="button" accessibilityLabel="Yopish" onPress={onClose}>
            <Text style={styles.closeText}>✕</Text>
          </Pressable>
        </View>
        <View style={styles.monthNav}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Oldingi oy"
            accessibilityState={{disabled:!canPrevious}}
            disabled={!canPrevious}
            style={styles.arrow}
            onPress={()=>setMonth(m=>shiftMonth(m,-1))}
          >
            <AppIcon name="chevron" color={colors.primary} size={19}/>
          </Pressable>
          <Text style={styles.monthTitle}>{monthTitle(month)}</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Keyingi oy"
            accessibilityState={{disabled:!canNext}}
            disabled={!canNext}
            style={[styles.arrow,!canNext&&styles.disabled]}
            onPress={()=>setMonth(m=>shiftMonth(m,1))}
          >
            <AppIcon name="chevron" color={colors.primary} size={19}/>
          </Pressable>
        </View>
        <View style={styles.grid}>
          {DAY_LABELS.map(label=><View key={label} style={styles.weekCell}><Text style={styles.weekLabel}>{label}</Text></View>)}
          {cells.map(cell=>{
            const selected=cell.dateISO===value;
            const future=cell.dateISO>todayISO;
            const blocked=!cell.isCurrentMonth||future;
            return <View key={cell.dateISO} style={styles.cell}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={cell.dateISO}
                accessibilityState={{selected,disabled:blocked}}
                disabled={blocked}
                style={[styles.dayButton,selected&&styles.selectedButton]}
                onPress={()=>select(cell.dateISO)}
              >
                <Text style={[
                  styles.dayText,
                  !cell.isCurrentMonth&&styles.outMonth,
                  future&&styles.futureText,
                  selected&&styles.selectedText,
                ]}>{cell.day}</Text>
              </Pressable>
            </View>;
          })}
        </View>
        <Pressable style={styles.today} accessibilityRole="button" onPress={()=>select(todayISO)}>
          <Text style={styles.todayText}>Bugun</Text>
        </Pressable>
        <Text style={styles.disclaimer}>Namuna ma’lumoti · kelajakdagi sana tanlanmaydi</Text>
      </View>
    </View>
  </Modal>;
}

const styles=StyleSheet.create({
  overlay:{flex:1,justifyContent:'flex-end',backgroundColor:'rgba(25,17,24,0.46)'},
  sheet:{backgroundColor:colors.surface,borderTopLeftRadius:radius.hero,borderTopRightRadius:radius.hero,paddingHorizontal:spacing.base,paddingTop:12,paddingBottom:30,...shadow.card},
  grabber:{width:37,height:5,alignSelf:'center',borderRadius:3,backgroundColor:'#D8C8CA',marginBottom:19},
  heading:{flexDirection:'row',alignItems:'center',marginBottom:18},
  eyebrow:{color:colors.primary,fontSize:10,letterSpacing:1.4,fontWeight:'800'},
  title:{fontSize:22,fontWeight:'800',color:colors.text,marginTop:4},
  close:{width:44,height:44,borderRadius:22,backgroundColor:colors.background,alignItems:'center',justifyContent:'center'},
  closeText:{fontSize:19,color:colors.primary},
  monthNav:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:11},
  arrow:{width:44,height:44,borderRadius:22,backgroundColor:colors.background,alignItems:'center',justifyContent:'center'},
  disabled:{opacity:0.35},
  monthTitle:{fontSize:16,fontWeight:'800',color:colors.text},
  grid:{flexDirection:'row',flexWrap:'wrap'},
  weekCell:{width:'14.2857%',alignItems:'center',justifyContent:'center',height:34},
  weekLabel:{fontSize:11,color:colors.faint,fontWeight:'700'},
  cell:{width:'14.2857%',alignItems:'center',justifyContent:'center',height:45},
  dayButton:{minHeight:43,width:'95%',alignItems:'center',justifyContent:'center',borderRadius:15},
  selectedButton:{backgroundColor:colors.primary},
  dayText:{fontSize:13,color:colors.text,fontWeight:'700'},
  outMonth:{color:'#C8B6BA'},
  futureText:{color:'#D7C9CD'},
  selectedText:{color:colors.white},
  today:{minHeight:48,backgroundColor:colors.primarySoft,borderRadius:radius.lg,alignItems:'center',justifyContent:'center',marginTop:10},
  todayText:{fontSize:13,color:colors.primary,fontWeight:'800'},
  disclaimer:{fontSize:10,color:colors.faint,textAlign:'center',marginTop:12},
});
