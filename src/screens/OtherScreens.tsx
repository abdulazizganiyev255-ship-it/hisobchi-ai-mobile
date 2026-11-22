import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {AppIcon, IconName} from '../components/AppIcon';
import {TransactionRow} from '../components/TransactionRow';
import {ExpenseChart} from '../components/ExpenseChart';
import {demo, formatMoney} from '../data/demo';
import {colors, radius} from '../theme/tokens';

export type Tab = 'home' | 'transactions' | 'analytics' | 'profile';

export function OtherScreen({tab}: {tab:Exclude<Tab,'home'>}) {
  const detail:{title:string;caption:string;icon:IconName} = tab==='transactions'
    ?{title:'Operatsiyalar',caption:'Demo ma’lumotlardan tashkil topgan tarix',icon:'receipt'}
    :tab==='analytics'?{title:'Tahlil',caption:'Oylik xarajatlarning namuna grafigi',icon:'chart'}
    :{title:'Profil',caption:'Hisobchi AI · Namoyish rejimi',icon:'user'};
  return <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
    <View style={styles.header}><View style={styles.icon}><AppIcon name={detail.icon} color={colors.primary} size={23}/></View><View style={{flex:1}}><Text style={styles.title}>{detail.title}</Text><Text style={styles.caption}>{detail.caption}</Text></View></View>
    {tab==='transactions' && <View style={styles.lightCard}>{demo.transactions.map((item,i)=><React.Fragment key={item.id}>{i>0&&<View style={styles.divider}/>}<TransactionRow light item={item}/></React.Fragment>)}</View>}
    {tab==='analytics' && <View style={styles.darkCard}><Text style={styles.section}>Jami xarajat (namuna)</Text><Text style={styles.amount}>{formatMoney(demo.months.current.total)}</Text><ExpenseChart values={demo.months.current.chart}/><Text style={styles.note}>Grafikni keyingi bosqichda Supabase’dan kelgan operatsiyalar bilan hisoblaymiz.</Text></View>}
    {tab==='profile' && <View style={styles.darkCard}><Text style={styles.section}>Dizayn prototipi v0.1</Text><Text style={styles.note}>Hozircha hisobga kirish, bank kartasini ulash, Supabase integratsiyasi va AI tahlili yoqilmagan. Bu interfeys va navigatsiyani sinash uchun tayyorlangan alohida prototip.</Text><View style={styles.profileLine}><AppIcon name="shield" size={19} color={colors.positive}/><Text style={styles.profileText}>Haqiqiy moliyaviy ma’lumotlar ishlatilmaydi</Text></View></View>}
  </ScrollView>;
}

const styles=StyleSheet.create({
  content:{padding:20,paddingTop:26,paddingBottom:36,gap:24},
  header:{flexDirection:'row',alignItems:'center',gap:12},icon:{height:50,width:50,borderRadius:16,backgroundColor:colors.surface,justifyContent:'center',alignItems:'center'},title:{fontSize:24,fontWeight:'800',color:colors.text},caption:{color:colors.muted,fontSize:12,marginTop:3},
  lightCard:{backgroundColor:colors.cardLight,borderRadius:radius.lg,padding:16},divider:{backgroundColor:'#CEE1EB',height:1,marginLeft:57},
  darkCard:{backgroundColor:colors.surface,borderRadius:radius.lg,padding:20,borderColor:colors.divider,borderWidth:1},section:{fontSize:15,color:colors.text,fontWeight:'700'},amount:{fontSize:27,fontWeight:'800',color:colors.text,marginTop:13},note:{color:colors.muted,fontSize:13,lineHeight:21,marginTop:15},profileLine:{marginTop:22,flexDirection:'row',gap:8,alignItems:'center'},profileText:{fontSize:12,color:colors.positive,flex:1}
});
