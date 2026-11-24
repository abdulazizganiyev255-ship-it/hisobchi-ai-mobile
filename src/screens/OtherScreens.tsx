import React from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {AppIcon, IconName} from '../components/AppIcon';
import {TransactionRow} from '../components/TransactionRow';
import {ExpenseChart} from '../components/ExpenseChart';
import {demo, formatMoney, Transaction} from '../data/demo';
import {EntryKind} from '../data/mockEntry';
import {colors, radius, spacing} from '../theme/tokens';

export type Tab = 'home' | 'transactions' | 'ai' | 'analytics' | 'profile';

type Detail = {title:string;caption:string;icon:IconName;eyebrow:string};
const details:Record<Exclude<Tab,'home'>,Detail> = {
  transactions:{
    title:'Tarix',
    caption:'Kirim va xarajatlaringiz bir joyda.',
    icon:'receipt',
    eyebrow:'OPERATSIYALAR'
  },
  ai:{
    title:'AI yordamchi',
    caption:'Moliyaviy qarorlar uchun dalilli tushuntirishlar.',
    icon:'sparkles',
    eyebrow:'INTELLIGENCE'
  },
  analytics:{
    title:'Tahlil',
    caption:'Pul oqimini ko‘rishning sodda usuli.',
    icon:'chart',
    eyebrow:'STATISTIKA'
  },
  profile:{
    title:'Profil',
    caption:'Hisob, maqsadlar va shaxsiy sozlamalar.',
    icon:'user',
    eyebrow:'SOZLAMALAR'
  }
};

export function OtherScreen({tab,transactions,demoCount,notice,onAddTransaction}:{
  tab:Exclude<Tab,'home'>;
  transactions:Transaction[];
  demoCount:number;
  notice:string;
  onAddTransaction:(kind:EntryKind)=>void;
}) {
  const detail = details[tab];
  return <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
    <View style={styles.header}>
      <View style={styles.headerIcon}><AppIcon name={detail.icon} color={colors.primary} size={23}/></View>
      <View style={styles.headerTitle}>
        <Text style={styles.eyebrow}>{detail.eyebrow}</Text>
        <Text style={styles.title}>{detail.title}</Text>
        <Text style={styles.caption}>{detail.caption}</Text>
      </View>
    </View>

    <View style={styles.demoPill}>
      <View style={styles.demoDot}/>
      <Text style={styles.demoPillText}>DIZAYN DEMOSI · REAL MA’LUMOT EMAS</Text>
    </View>

    {tab==='transactions' && <View style={styles.card}>
      <View style={styles.historyHeader}>
        <View style={{flex:1}}>
          <Text style={styles.sectionHeading}>Namuna tarixi</Text>
          <Text style={styles.sectionHint}>{demoCount>0?`Yangi mock yozuvlar: ${demoCount}`:'Namunaviy operatsiyalar'}</Text>
        </View>
        <Pressable
          style={styles.addButton}
          accessibilityRole="button"
          accessibilityLabel="Yangi xarajat qo‘shish"
          onPress={()=>onAddTransaction('expense')}
        ><AppIcon name="plus" color={colors.white} size={18}/><Text style={styles.addButtonText}>Qo‘shish</Text></Pressable>
      </View>
      {notice?<View style={styles.notice}><AppIcon name="check" color={colors.positive} size={18}/><Text style={styles.noticeText}>{notice}</Text></View>:null}
      {transactions.map((item,i)=><React.Fragment key={item.id}>
        {i>0&&<View style={styles.divider}/>}
        <TransactionRow light item={item}/>
      </React.Fragment>)}
    </View>}

    {tab==='analytics' && <>
      <View style={styles.card}>
        <Text style={styles.eyebrow}>BU OY · NAMUNA</Text>
        <Text style={styles.amount}>{formatMoney(demo.months.current.total)}</Text>
        <Text style={styles.sectionHint}>Grafikdagi qiymatlar haqiqiy hisobdan olinmagan.</Text>
        <ExpenseChart values={demo.months.current.chart}/>
      </View>
      <View style={styles.subCard}>
        <View style={styles.subIcon}><AppIcon name="shield" color={colors.primary} size={18}/></View>
        <View style={{flex:1}}>
          <Text style={styles.subTitle}>Izchil hisoblash</Text>
          <Text style={styles.subText}>Haqiqiy tahlil Finance Engine ulanishidan keyin bir xil ledger snapshotiga asoslanadi.</Text>
        </View>
      </View>
    </>}

    {tab==='ai' && <>
      <View style={styles.aiHero}>
        <View style={styles.aiSparkle}><AppIcon name="sparkles" color={colors.primary} size={25}/></View>
        <Text style={styles.aiTitle}>Raqamlarni tushunarli qarorlarga aylantiramiz.</Text>
        <Text style={styles.aiBody}>AI hozir ulanmagan. Keyinchalik har bir xulosa haqiqiy transaction va hisoblangan davrga asoslanadi.</Text>
        <View style={styles.aiStatus}><View style={styles.statusDot}/><Text style={styles.aiStatusText}>Integratsiya kutilmoqda</Text></View>
      </View>
      <View style={styles.card}>
        <Text style={styles.sectionHeading}>Yordamchi qanday ishlaydi?</Text>
        <Text style={styles.explainLine}>01  Tasdiqlangan ledger ma’lumotini oladi.</Text>
        <Text style={styles.explainLine}>02  Finance Engine faktlarni hisoblaydi.</Text>
        <Text style={styles.explainLine}>03  AI manba va davr bilan izohlaydi.</Text>
      </View>
    </>}

    {tab==='profile' && <>
      <View style={styles.card}>
        <View style={styles.profileHeader}>
          <View style={styles.avatar}><AppIcon name="user" color={colors.primary} size={27}/></View>
          <View style={{flex:1}}>
            <Text style={styles.profileTitle}>Demo profil</Text>
            <Text style={styles.sectionHint}>Haqiqiy login hali ulanmagan</Text>
          </View>
        </View>
        <View style={styles.divider}/>
        <View style={styles.settingRow}><AppIcon name="wallet" color={colors.primary} size={19}/><Text style={styles.settingTitle}>Hisoblar va balans</Text><Text style={styles.settingHint}>Keyin ulanadi</Text></View>
        <View style={styles.divider}/>
        <View style={styles.settingRow}><AppIcon name="shield" color={colors.primary} size={19}/><Text style={styles.settingTitle}>Xavfsizlik</Text><Text style={styles.settingHint}>Keyin ulanadi</Text></View>
        <View style={styles.divider}/>
        <View style={styles.settingRow}><AppIcon name="bell" color={colors.primary} size={19}/><Text style={styles.settingTitle}>Bildirishnomalar</Text><Text style={styles.settingHint}>Keyin ulanadi</Text></View>
      </View>
      <View style={styles.subCard}>
        <AppIcon name="shield" color={colors.positive} size={21}/>
        <Text style={styles.subText}>Bu prototip hech qanday haqiqiy bank yoki Supabase hisobiga ulanmagan.</Text>
      </View>
    </>}
  </ScrollView>;
}

const styles=StyleSheet.create({
  content:{paddingHorizontal:spacing.lg,paddingTop:24,paddingBottom:35,gap:16},
  header:{flexDirection:'row',alignItems:'center',gap:13},
  headerIcon:{height:56,width:56,borderRadius:19,backgroundColor:colors.primarySoft,alignItems:'center',justifyContent:'center'},
  headerTitle:{flex:1,gap:3},
  eyebrow:{fontSize:10,letterSpacing:1.4,fontWeight:'800',color:colors.primary},
  title:{fontSize:28,fontWeight:'800',letterSpacing:-0.9,color:colors.text},
  caption:{color:colors.muted,fontSize:11,lineHeight:17},
  demoPill:{alignSelf:'flex-start',flexDirection:'row',alignItems:'center',gap:7,paddingHorizontal:10,paddingVertical:7,borderRadius:radius.pill,backgroundColor:colors.surfaceRaised},
  demoDot:{height:5,width:5,borderRadius:3,backgroundColor:colors.primary},
  demoPillText:{fontSize:9,letterSpacing:0.3,color:colors.primary,fontWeight:'700'},
  card:{backgroundColor:colors.surface,borderRadius:radius.xl,padding:18,borderWidth:1,borderColor:colors.divider},
  sectionHeading:{fontSize:18,fontWeight:'800',letterSpacing:-0.4,color:colors.text},
  historyHeader:{flexDirection:'row',alignItems:'center',gap:10,marginBottom:4},
  addButton:{minHeight:44,backgroundColor:colors.primary,borderRadius:radius.md,flexDirection:'row',alignItems:'center',paddingHorizontal:12,gap:7},
  addButtonText:{fontSize:12,fontWeight:'800',color:colors.white},
  notice:{flexDirection:'row',gap:9,alignItems:'center',backgroundColor:'#E7F2E9',padding:12,borderRadius:radius.md,marginBottom:12},
  noticeText:{fontSize:11,color:colors.positive,flex:1,lineHeight:16},
  sectionHint:{fontSize:11,color:colors.muted,marginTop:5,marginBottom:12,lineHeight:16},
  divider:{backgroundColor:colors.line,height:1,marginVertical:3},
  amount:{fontSize:31,fontWeight:'800',color:colors.text,marginTop:12},
  subCard:{backgroundColor:'#F3E5E0',borderRadius:radius.lg,padding:17,flexDirection:'row',alignItems:'flex-start',gap:12},
  subIcon:{height:32,width:32,borderRadius:11,backgroundColor:colors.surface,alignItems:'center',justifyContent:'center'},
  subTitle:{fontSize:13,fontWeight:'800',color:colors.primary},
  subText:{fontSize:12,color:colors.muted,lineHeight:19,flexShrink:1,flex:1},
  aiHero:{backgroundColor:'#F5E3E5',borderRadius:radius.xl,padding:23,minHeight:270,borderWidth:1,borderColor:'#ECD4DB'},
  aiSparkle:{height:48,width:48,borderRadius:17,backgroundColor:colors.surface,alignItems:'center',justifyContent:'center',marginBottom:17},
  aiTitle:{fontSize:24,fontWeight:'800',color:colors.primary,letterSpacing:-0.8,lineHeight:31},
  aiBody:{fontSize:13,color:colors.muted,lineHeight:21,marginTop:12},
  aiStatus:{alignSelf:'flex-start',marginTop:22,backgroundColor:colors.surface,paddingHorizontal:12,paddingVertical:8,borderRadius:radius.pill,flexDirection:'row',alignItems:'center',gap:7},
  statusDot:{height:6,width:6,borderRadius:3,backgroundColor:colors.primary},
  aiStatusText:{fontSize:11,fontWeight:'700',color:colors.primary},
  explainLine:{color:colors.muted,fontSize:12,lineHeight:22,marginTop:7},
  profileHeader:{flexDirection:'row',alignItems:'center',gap:12,marginBottom:11},
  avatar:{height:53,width:53,borderRadius:19,backgroundColor:colors.primarySoft,alignItems:'center',justifyContent:'center'},
  profileTitle:{fontSize:17,fontWeight:'800',color:colors.text},
  settingRow:{minHeight:58,flexDirection:'row',alignItems:'center',gap:10},
  settingTitle:{color:colors.text,fontSize:13,fontWeight:'700',flex:1},
  settingHint:{color:colors.faint,fontSize:10},
});
