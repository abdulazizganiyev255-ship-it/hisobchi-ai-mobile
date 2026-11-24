import {useState} from 'react';
import {ScrollView,StyleSheet,Text,TextInput,View} from 'react-native';
import {AppIcon} from '../components/AppIcon';
import {formatMoney,type Transaction} from '../data/demo';
import {filterAndSortTransactions,type TransactionFilter} from '../data/transactions';
import {sumTransactionTotals} from '../data/periods';
import {T} from './theme';
import {ActionButton,Eyebrow,FilterPill,Header,SampleFlag,TransactionLine} from './UI';

type Props={items:Transaction[];onAdd:()=>void;onEdit:(item:Transaction)=>void};

export function Activity({items,onAdd,onEdit}:Props){
  const [filter,setFilter]=useState<TransactionFilter>('all'),[query,setQuery]=useState('');
  const rows=filterAndSortTransactions(items,filter,query),totals=sumTransactionTotals(rows);
  return <ScrollView testID="reboot-activity" style={s.root} contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
    <Header section="OPERATSIYALAR"/><SampleFlag/>
    <View style={s.title}><Eyebrow>02 / 04  —  QAYDLAR</Eyebrow>
      <Text style={s.heading}>Pulning har bir izi.</Text>
      <Text style={s.subtitle}>Qidirish, filtrlash va tahrirlash — barchasi bir joyda.</Text></View>
    <ActionButton title="Yangi operatsiya" subtitle="Xarajat yoki daromad" onPress={onAdd} testID="reboot-activity-add"/>
    <View style={s.search}><AppIcon name="receipt" size={19} color={T.muted}/>
      <TextInput testID="reboot-activity-search" accessibilityLabel="Operatsiya qidirish"
        placeholder="Operatsiyalar ichidan qidiring" placeholderTextColor={T.muted} value={query}
        onChangeText={setQuery} autoCorrect={false} style={s.searchInput}/></View>
    <View style={s.filters}>{([
      ['all','Barchasi'],['expense','Xarajat'],['income','Daromad'],
    ] as const).map(([key,label])=>
      <FilterPill key={key} title={label} active={filter===key} onPress={()=>setFilter(key)}
        testID={'reboot-filter-'+key}/>)}</View>
    <View style={s.summary}>
      <View><Eyebrow>NATIJADA</Eyebrow><Text style={s.count}>{rows.length} ta yozuv</Text></View>
      <View style={{alignItems:'flex-end'}}><Eyebrow>CHIQIM / KIRIM</Eyebrow>
        <Text testID="reboot-activity-totals" style={s.totals}>
          {formatMoney(totals.expense)} / {formatMoney(totals.income)}</Text></View>
    </View>
    <View style={s.list}>{rows.length?rows.map(x=><TransactionLine key={x.id} item={x} onPress={()=>onEdit(x)}/>):
      <View style={s.empty}><Text style={s.emptyTitle}>Mos operatsiya topilmadi</Text>
        <Text style={s.emptyText}>Qidiruvni o‘zgartiring yoki yangi operatsiya kiriting.</Text></View>}</View>
    <Text style={s.foot}>Operatsiyalar serverga yuborilmaydi. Bu faqat mahalliy sessiya.</Text>
  </ScrollView>;
}
const s=StyleSheet.create({
  root:{flex:1,backgroundColor:T.canvas},content:{paddingHorizontal:18,paddingTop:7,paddingBottom:40},
  title:{marginTop:25,marginBottom:20},
  heading:{fontSize:29,fontWeight:'900',letterSpacing:-1.3,color:T.ink,marginTop:9},
  subtitle:{fontSize:13,color:T.muted,lineHeight:20,marginTop:7},
  search:{marginTop:17,height:52,borderRadius:12,borderWidth:1,borderColor:T.border,backgroundColor:T.paper,
    flexDirection:'row',alignItems:'center',gap:9,paddingHorizontal:13},
  searchInput:{flex:1,minWidth:0,fontSize:13,color:T.ink},
  filters:{marginTop:12,flexDirection:'row',gap:8,flexWrap:'wrap'},
  summary:{marginTop:18,paddingVertical:14,borderTopWidth:1,borderBottomWidth:1,borderColor:T.border,
    flexDirection:'row',justifyContent:'space-between',alignItems:'center',gap:8},
  count:{fontSize:17,fontWeight:'900',color:T.ink,marginTop:6},
  totals:{fontSize:10,fontWeight:'700',color:T.secondary,marginTop:7},
  list:{marginTop:14,backgroundColor:T.paper,borderRadius:13,borderWidth:1,borderColor:T.border,paddingHorizontal:12},
  empty:{padding:19},emptyTitle:{fontSize:15,fontWeight:'800',color:T.ink},
  emptyText:{fontSize:12,color:T.muted,lineHeight:19,marginTop:7},
  foot:{fontSize:11,color:T.muted,marginTop:21,lineHeight:18},
});
