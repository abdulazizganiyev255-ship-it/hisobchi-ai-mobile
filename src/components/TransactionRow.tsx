
import {StyleSheet, Text, View} from 'react-native';
import {Transaction, formatMoney} from '../data/demo';
import {AppIcon} from './AppIcon';
import {colors} from '../theme/tokens';

export function TransactionRow({item, light=false}: {item:Transaction; light?:boolean}) {
  return <View style={styles.row}>
    <View style={[styles.iconBg,{backgroundColor:item.iconBg}]}><AppIcon name={item.icon} color={item.iconColor} size={21}/></View>
    <View style={styles.info}><Text style={[styles.title, light && styles.darkText]} numberOfLines={1}>{item.title}</Text><Text style={[styles.subtitle,light&&styles.darkMuted]} numberOfLines={1}>{item.date}</Text></View>
    <Text style={[styles.amount,{color:item.amount>0?(light?'#167459':colors.positive):(light?'#AE5252':colors.text)}]} numberOfLines={1}>{item.amount>0?'+':''}{formatMoney(item.amount)}</Text>
  </View>;
}

const styles=StyleSheet.create({
  row:{flexDirection:'row',alignItems:'center',minHeight:65,gap:12},
  iconBg:{width:45,height:45,borderRadius:14,alignItems:'center',justifyContent:'center'},
  info:{flex:1,minWidth:0,gap:5},
  title:{color:colors.text,fontWeight:'600',fontSize:14},
  subtitle:{color:colors.muted,fontSize:11},
  amount:{fontWeight:'700',fontSize:12,flexShrink:0},
  darkText:{color:colors.ink},darkMuted:{color:'#7089A0'}
});

