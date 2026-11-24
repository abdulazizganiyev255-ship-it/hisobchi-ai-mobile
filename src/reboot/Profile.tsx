import {useState} from 'react';
import {Modal,Pressable,ScrollView,StyleSheet,Text,View} from 'react-native';
import {AppIcon} from '../components/AppIcon';
import type {Transaction} from '../data/demo';
import {T} from './theme';
import {Eyebrow,Header,SampleFlag,SectionHead} from './UI';

type Props={items:Transaction[];onReset:()=>void};

export function Profile({items,onReset}:Props){
  const [confirm,setConfirm]=useState(false);
  return <>
    <ScrollView testID="reboot-profile" style={s.root} contentContainerStyle={s.content}>
      <Header section="BOSHQARUV"/><SampleFlag/>
      <View style={s.intro}><Eyebrow>04 / 04  —  NAZORAT</Eyebrow>
        <Text style={s.heading}>Sizning qoidalaringiz.</Text>
        <Text style={s.subtitle}>Sodda boshqaruv, ochiq ma’lumot manbai va tushunarli holatlar.</Text>
      </View>
      <View style={s.userPanel}>
        <View style={s.avatar}><Text style={s.avatarLetter}>H</Text></View>
        <View style={{flex:1}}><Text style={s.userTitle}>Namuna profil</Text>
          <Text style={s.userSub}>Mahalliy sessiya · akkaunt ulanmagan</Text></View>
        <Text style={s.demoMark}>DEMO</Text>
      </View>
      <View style={s.section}><SectionHead title="Modullar holati" note="FINANCIAL READINESS"/>
        {[
          ['01','Operatsiyalar',items.length+' ta yozuv · sessiyada ishlaydi','FAOL'],
          ['02','Hisoblar va Safe-to-Spend','Ulanmagan · haqiqiy balans yo‘q','KEYIN'],
          ['03','Kunlik AI hisobot','20:00 rejalangan · hali ishlamaydi','KEYIN'],
        ].map(([number,title,subtitle,status])=>
          <View key={number} style={s.statusRow}>
            <View style={s.rowNum}><Text style={s.rowNumText}>{number}</Text></View>
            <View style={{flex:1,minWidth:0}}><Text style={s.rowTitle}>{title}</Text>
              <Text style={s.rowSub}>{subtitle}</Text></View>
            <Text style={[s.rowStatus,status==='FAOL'&&{color:T.positive}]}>{status}</Text>
          </View>
        )}
      </View>
      <View style={s.section}><SectionHead title="Namuna rejimi" note="MA’LUMOTLAR"/>
        <Pressable testID="reboot-reset-open" accessibilityRole="button"
          accessibilityLabel="Demo yozuvlarini tiklash" onPress={()=>setConfirm(true)}
          style={({pressed})=>[s.reset,pressed&&{opacity:.8}]}>
          <View style={{flex:1}}><Text style={s.resetTitle}>Namuna yozuvlarini tiklash</Text>
            <Text style={s.resetSub}>Sessiyadagi qo‘shilgan va tahrirlangan yozuvlar o‘chadi.</Text></View>
          <AppIcon name="chevron" color={T.cobalt} size={18}/>
        </Pressable>
      </View>
      <View style={s.footer}><Text style={s.footerTitle}>HISOBCHI / PUL IZI</Text>
        <Text style={s.footerText}>Hozir Auth, to‘lov, real bank API va AI ulanmagan. Operatsiyalar ushbu sessiyada saqlanadi, serverda emas.</Text></View>
    </ScrollView>
    <Modal transparent visible={confirm} animationType="fade" onRequestClose={()=>setConfirm(false)}>
      <View style={s.modalBg}><View style={s.dialog}>
        <Eyebrow>QAYTA TIKLASH</Eyebrow>
        <Text style={s.dialogTitle}>Boshlang‘ich holatga qaytamizmi?</Text>
        <Text style={s.dialogBody}>Sessiyadagi yangi yozuvlar o‘chadi, dastlabki 5 ta namuna qaytadi.</Text>
        <Pressable testID="reboot-reset-confirm" accessibilityRole="button"
          style={s.confirmButton} onPress={()=>{onReset();setConfirm(false);}}>
          <Text style={s.confirmText}>Ha, tiklash</Text></Pressable>
        <Pressable accessibilityRole="button" style={s.cancelButton} onPress={()=>setConfirm(false)}>
          <Text style={s.cancelText}>Bekor qilish</Text></Pressable>
      </View></View>
    </Modal>
  </>;
}
const s=StyleSheet.create({
  root:{flex:1,backgroundColor:T.canvas},content:{paddingHorizontal:18,paddingTop:7,paddingBottom:45},
  intro:{marginTop:26},heading:{fontSize:29,fontWeight:'900',color:T.ink,marginTop:10,letterSpacing:-1.3},
  subtitle:{fontSize:13,color:T.muted,lineHeight:20,marginTop:9},
  userPanel:{marginTop:24,padding:15,backgroundColor:T.strip,borderRadius:15,flexDirection:'row',alignItems:'center',gap:12},
  avatar:{width:46,height:46,borderRadius:12,alignItems:'center',justifyContent:'center',backgroundColor:'#CFDAFF'},
  avatarLetter:{fontSize:24,fontWeight:'900',color:T.cobalt},
  userTitle:{fontSize:16,color:T.white,fontWeight:'800'},
  userSub:{color:'#C4D0DF',fontSize:10,marginTop:6},
  demoMark:{fontSize:9,fontWeight:'900',color:T.white,borderColor:'#697587',borderWidth:1,padding:7,borderRadius:6},
  section:{marginTop:28},
  statusRow:{minHeight:75,flexDirection:'row',alignItems:'center',gap:11,borderBottomWidth:1,borderBottomColor:T.border,paddingVertical:10},
  rowNum:{width:36,height:36,backgroundColor:T.cobaltWash,borderRadius:10,justifyContent:'center',alignItems:'center'},
  rowNumText:{fontWeight:'900',color:T.cobalt,fontSize:12},
  rowTitle:{fontSize:13,fontWeight:'800',color:T.ink},
  rowSub:{fontSize:11,color:T.muted,marginTop:5,lineHeight:17},
  rowStatus:{fontSize:9,fontWeight:'900',color:T.muted,letterSpacing:.6},
  reset:{padding:15,backgroundColor:T.paper,minHeight:83,borderRadius:12,borderColor:T.border,borderWidth:1,flexDirection:'row',alignItems:'center',gap:8},
  resetTitle:{fontSize:13,fontWeight:'800',color:T.ink},
  resetSub:{fontSize:11,color:T.muted,marginTop:5,lineHeight:17},
  footer:{marginTop:29,borderTopWidth:1,borderColor:T.border,paddingTop:18},
  footerTitle:{fontSize:10,fontWeight:'900',letterSpacing:1,color:T.cobalt},
  footerText:{fontSize:11,color:T.muted,lineHeight:18,marginTop:9},
  modalBg:{flex:1,backgroundColor:'rgba(12,20,32,0.55)',justifyContent:'center',padding:24},
  dialog:{padding:22,backgroundColor:T.paper,borderRadius:16,gap:12},
  dialogTitle:{fontSize:22,fontWeight:'900',color:T.ink},
  dialogBody:{fontSize:13,color:T.muted,lineHeight:20},
  confirmButton:{backgroundColor:T.coral,minHeight:49,alignItems:'center',justifyContent:'center',borderRadius:10,marginTop:5},
  confirmText:{fontSize:14,fontWeight:'800',color:T.white},
  cancelButton:{minHeight:44,justifyContent:'center',alignItems:'center'},
  cancelText:{fontSize:13,fontWeight:'700',color:T.secondary},
});
