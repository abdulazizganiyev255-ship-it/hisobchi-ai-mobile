import {useRef,useState} from 'react';
import {KeyboardAvoidingView,Modal,Platform,Pressable,ScrollView,StyleSheet,Text,TextInput,View} from 'react-native';
import {AppIcon} from '../components/AppIcon';
import {type Transaction} from '../data/demo';
import {CATEGORY_OPTIONS,toDraft,validateDraft,type TransactionDraft,type FormErrors,type TransactionKind} from '../data/transactions';
import {Calendar} from './Calendar';
import {T} from './theme';
import {Eyebrow,FilterPill} from './UI';

type Props={
  initial?:Transaction;kind:TransactionKind;
  onCancel:()=>void;onSave:(draft:TransactionDraft)=>void;onDelete:()=>void;
};

export function Entry({initial,kind,onCancel,onSave,onDelete}:Props){
  const [draft,setDraft]=useState<TransactionDraft>(()=>{
    const base=toDraft(initial);
    return initial?base:{...base,kind,category:CATEGORY_OPTIONS[kind][0].label};
  });
  const [errors,setErrors]=useState<FormErrors>({});
  const [calendarOpen,setCalendarOpen]=useState(false);
  const [deleteOpen,setDeleteOpen]=useState(false);
  const saving=useRef(false);
  const change=<K extends keyof TransactionDraft>(key:K,value:TransactionDraft[K])=>{
    setDraft(old=>({...old,[key]:value}));setErrors(old=>({...old,[key]:undefined}));
  };
  const changeKind=(next:TransactionKind)=>{
    if(draft.kind===next)return;
    setDraft(old=>({...old,kind:next,category:CATEGORY_OPTIONS[next][0].label}));
    setErrors({});
  };
  const save=()=>{
    if(saving.current)return;
    const next=validateDraft(draft);setErrors(next);
    if(Object.values(next).some(Boolean))return;
    saving.current=true;
    try{onSave(draft);}catch(error){saving.current=false;throw error;}
  };
  return <>
    <KeyboardAvoidingView testID="reboot-editor" style={s.root}
      behavior={Platform.OS==='ios'?'padding':undefined}>
      <ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
        <View style={s.top}>
          <Pressable accessibilityRole="button" accessibilityLabel="Orqaga" onPress={onCancel}
            style={s.back}><AppIcon name="arrow-left" size={21} color={T.ink}/></Pressable>
          <Eyebrow>YANGI QAYD · MAHALLIY SESSIYA</Eyebrow>
        </View>
        <Text style={s.title}>{initial?'Operatsiyani tahrirlash':'Pul harakatini kiriting.'}</Text>
        <Text style={s.subtitle}>Qaydlar bitta moliyaviy hisobotda jamlanadi. Bu demo — serverga saqlanmaydi.</Text>

        <View style={s.kindRow}>
          <FilterPill title="Xarajat" active={draft.kind==='expense'} onPress={()=>changeKind('expense')} testID="reboot-kind-expense"/>
          <FilterPill title="Daromad" active={draft.kind==='income'} onPress={()=>changeKind('income')} testID="reboot-kind-income"/>
        </View>
        <Text style={s.label}>SUMMA · SO‘M</Text>
        <View style={s.amountField}>
          <TextInput testID="reboot-entry-amount" accessibilityLabel="Operatsiya summasi, so‘m"
            value={draft.amountText} onChangeText={v=>change('amountText',v)}
            keyboardType="number-pad" placeholder="0" placeholderTextColor={T.muted}
            style={s.amountInput} autoFocus={false}/>
          <Text style={s.amountSuffix}>UZS</Text>
        </View>
        {errors.amountText?<Text style={s.error}>{errors.amountText}</Text>:null}

        <Text style={s.label}>KATEGORIYA</Text>
        <View style={s.categories}>
          {CATEGORY_OPTIONS[draft.kind].map(c=>
            <Pressable key={c.label} testID={'reboot-category-'+c.label}
              accessibilityRole="button" accessibilityState={{selected:draft.category===c.label}}
              onPress={()=>change('category',c.label)}
              style={[s.categoryChip,draft.category===c.label&&s.categorySelected]}>
              <Text style={[s.categoryLabel,draft.category===c.label&&s.categorySelectedText]}>{c.label}</Text>
            </Pressable>)}
        </View>
        {errors.category?<Text style={s.error}>{errors.category}</Text>:null}

        <Text style={s.label}>SANA</Text>
        <Pressable accessibilityRole="button" testID="reboot-entry-date"
          accessibilityLabel="Operatsiya sanasini tanlash"
          onPress={()=>setCalendarOpen(true)} style={s.dateField}>
          <AppIcon name="calendar" size={19} color={T.cobalt}/>
          <Text style={s.dateText}>{draft.occurredOn}</Text>
          <AppIcon name="chevron" size={17} color={T.cobalt}/>
        </Pressable>
        {errors.occurredOn?<Text style={s.error}>{errors.occurredOn}</Text>:null}

        <Text style={s.label}>IZOH · IXTiyoriy</Text>
        <TextInput testID="reboot-entry-note" accessibilityLabel="Operatsiya izohi"
          multiline placeholder="Nima uchun sarflandi yoki qayerdan keldi?"
          placeholderTextColor={T.muted} value={draft.note}
          onChangeText={v=>change('note',v)} maxLength={180}
          style={s.note}/>
        <Pressable testID="reboot-entry-save" accessibilityRole="button"
          accessibilityLabel={initial?'O‘zgarishlarni saqlash':'Operatsiyani qo‘shish'}
          onPress={save} style={s.saveButton}>
          <Text style={s.saveText}>{initial?'O‘zgarishlarni saqlash':'Operatsiyani qo‘shish'}</Text>
          <AppIcon name="check" size={20} color={T.white}/>
        </Pressable>
        {initial?<Pressable testID="reboot-delete-open" accessibilityRole="button"
          onPress={()=>setDeleteOpen(true)} style={s.deleteButton}>
          <Text style={s.deleteText}>Operatsiyani o‘chirish</Text></Pressable>:null}
      </ScrollView>
    </KeyboardAvoidingView>

    {calendarOpen?<Calendar value={draft.occurredOn} onClose={()=>setCalendarOpen(false)}
      onSelect={iso=>{change('occurredOn',iso);setCalendarOpen(false);}}/>:null}
    <Modal transparent visible={deleteOpen} animationType="fade"
      onRequestClose={()=>setDeleteOpen(false)}>
      <View style={s.modalBg}><View style={s.modal}>
        <Eyebrow>O‘CHIRISHNI TASDIQLASH</Eyebrow>
        <Text style={s.modalTitle}>Yozuv o‘chirilsinmi?</Text>
        <Text style={s.modalBody}>Bu operatsiya sessiyadagi barcha hisoblardan chiqariladi.</Text>
        <Pressable accessibilityRole="button" testID="reboot-delete-confirm"
          onPress={onDelete} style={s.deleteConfirm}><Text style={s.deleteConfirmText}>Ha, o‘chirish</Text></Pressable>
        <Pressable accessibilityRole="button" onPress={()=>setDeleteOpen(false)}
          style={s.deleteCancel}><Text style={s.cancelText}>Bekor qilish</Text></Pressable>
      </View></View>
    </Modal>
  </>;
}
const s=StyleSheet.create({
  root:{flex:1,backgroundColor:T.canvas},content:{paddingHorizontal:18,paddingTop:13,paddingBottom:44},
  top:{flexDirection:'row',alignItems:'center',gap:15},
  back:{minHeight:44,minWidth:44,justifyContent:'center'},
  title:{fontSize:30,fontWeight:'900',letterSpacing:-1.5,color:T.ink,marginTop:20},
  subtitle:{fontSize:12,color:T.muted,lineHeight:20,marginTop:9},
  kindRow:{flexDirection:'row',gap:9,marginTop:23},
  label:{marginTop:24,marginBottom:9,fontSize:10,color:T.muted,fontWeight:'900',letterSpacing:1.15},
  amountField:{height:75,backgroundColor:T.white,borderWidth:1,borderColor:T.border,borderRadius:13,flexDirection:'row',alignItems:'center',paddingHorizontal:14},
  amountInput:{flex:1,fontSize:32,fontWeight:'900',color:T.ink,letterSpacing:-1.3,paddingVertical:10},
  amountSuffix:{fontSize:11,fontWeight:'900',color:T.cobalt},
  categories:{flexDirection:'row',flexWrap:'wrap',gap:8},
  categoryChip:{minHeight:43,backgroundColor:T.white,borderRadius:10,borderWidth:1,borderColor:T.border,paddingHorizontal:13,justifyContent:'center'},
  categorySelected:{backgroundColor:T.cobaltWash,borderColor:T.cobalt},
  categoryLabel:{fontSize:12,fontWeight:'700',color:T.secondary},
  categorySelectedText:{color:T.cobalt,fontWeight:'900'},
  dateField:{height:53,backgroundColor:T.white,borderWidth:1,borderColor:T.border,borderRadius:11,paddingHorizontal:15,flexDirection:'row',alignItems:'center',gap:11},
  dateText:{flex:1,fontSize:14,color:T.ink,fontWeight:'700'},
  note:{backgroundColor:T.white,borderColor:T.border,borderWidth:1,borderRadius:12,minHeight:82,fontSize:13,color:T.ink,textAlignVertical:'top',padding:13},
  error:{fontSize:11,color:T.coral,marginTop:7},
  saveButton:{height:56,backgroundColor:T.cobalt,borderRadius:13,flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:18,marginTop:24},
  saveText:{fontSize:15,fontWeight:'900',color:T.white},
  deleteButton:{minHeight:49,alignItems:'center',justifyContent:'center',marginTop:15},
  deleteText:{fontSize:13,fontWeight:'800',color:T.coral},
  modalBg:{flex:1,backgroundColor:'rgba(12,20,32,.55)',justifyContent:'center',padding:23},
  modal:{backgroundColor:T.white,borderRadius:15,padding:21,gap:12},
  modalTitle:{fontSize:22,fontWeight:'900',color:T.ink},
  modalBody:{fontSize:13,lineHeight:20,color:T.muted},
  deleteConfirm:{minHeight:49,backgroundColor:T.coral,borderRadius:11,justifyContent:'center',alignItems:'center',marginTop:4},
  deleteConfirmText:{fontSize:14,fontWeight:'800',color:T.white},
  deleteCancel:{minHeight:44,justifyContent:'center',alignItems:'center'},
  cancelText:{fontSize:13,fontWeight:'700',color:T.secondary},
});
