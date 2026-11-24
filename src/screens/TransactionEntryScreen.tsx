import {useState} from 'react';
import {Alert,KeyboardAvoidingView,Platform,Pressable,ScrollView,StyleSheet,Text,TextInput,View} from 'react-native';
import {CalendarSheet} from '../components/CalendarSheet';
import {AppIcon} from '../components/AppIcon';
import {formatUzDate,toLocalISODate} from '../data/calendar';
import {categories,cleanMoneyInput,EntryKind,MAX_MOCK_AMOUNT,MockEntryDraft,validateMockEntry} from '../data/mockEntry';
import {colors,radius,shadow,spacing} from '../theme/tokens';

type Props={
  initialKind:EntryKind;
  onCancel:()=>void;
  onSave:(entry:MockEntryDraft)=>void;
};

export function TransactionEntryScreen({initialKind,onCancel,onSave}:Props) {
  const [kind,setKind]=useState<EntryKind>(initialKind);
  const [amountDigits,setAmountDigits]=useState('');
  const [categoryId,setCategoryId]=useState(categories[initialKind][0].id);
  const [note,setNote]=useState('');
  const [todayISO]=useState(()=>toLocalISODate(new Date()));
  const [occurredOn,setOccurredOn]=useState(todayISO);
  const [calendarOpen,setCalendarOpen]=useState(false);
  const [error,setError]=useState<string|null>(null);

  const changeKind=(next:EntryKind)=>{
    if(next===kind)return;
    setKind(next);
    setCategoryId(categories[next][0].id);
    setError(null);
  };

  const draft:MockEntryDraft={kind,amountDigits,categoryId,occurredOn,note};
  const amountNumber=Number(amountDigits||'0');
  const hint=amountNumber>MAX_MOCK_AMOUNT?'Summa juda katta':amountDigits?new Intl.NumberFormat('ru-RU').format(amountNumber)+' so‘m':'Summani kiriting';

  const handleCancel=()=>{
    const changed=amountDigits!==''||note.trim()!==''||occurredOn!==todayISO;
    if(!changed){onCancel();return;}
    Alert.alert(
      'Kiritishni bekor qilish?',
      'Ushbu mock yozuv hali saqlanmagan.',
      [
        {text:'Davom etish',style:'cancel'},
        {text:'Bekor qilish',style:'destructive',onPress:onCancel},
      ]
    );
  };

  const handleSave=()=>{
    const validationError=validateMockEntry(draft,todayISO);
    if(validationError){setError(validationError);return;}
    setError(null);
    onSave(draft);
  };

  return <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS==='ios'?'padding':undefined}>
    <View style={styles.header}>
      <Pressable
        style={styles.backButton}
        accessibilityRole="button"
        accessibilityLabel="Ortga"
        onPress={handleCancel}
      ><AppIcon name="arrow-left" color={colors.primary} size={21}/></Pressable>
      <View style={styles.headerText}>
        <Text style={styles.kicker}>YANGI OPERATSIYA</Text>
        <Text style={styles.pageTitle}>Pul harakati</Text>
      </View>
      <View style={styles.demoTag}><Text style={styles.demoTagText}>DEMO</Text></View>
    </View>

    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.kindSwitch}>
        {(['expense','income'] as const).map(value=>{
          const active=value===kind;
          return <Pressable
            key={value}
            accessibilityRole="button"
            accessibilityLabel={value==='expense'?'Xarajat':'Kirim'}
            accessibilityState={{selected:active}}
            style={[styles.kindOption,active&&styles.kindActive]}
            onPress={()=>changeKind(value)}
          ><Text style={[styles.kindText,active&&styles.kindTextActive]}>{value==='expense'?'Xarajat':'Kirim'}</Text></Pressable>;
        })}
      </View>

      <View style={styles.amountCard}>
        <Text style={styles.fieldLabel}>SUMMA</Text>
        <View style={styles.moneyRow}>
          <TextInput
            value={amountDigits}
            onChangeText={value=>{setAmountDigits(cleanMoneyInput(value));setError(null);}}
            keyboardType="number-pad"
            inputMode="numeric"
            placeholder="0"
            placeholderTextColor="#B59FA7"
            style={styles.moneyInput}
            maxLength={12}
            selectionColor={colors.primary}
            accessibilityLabel="Summa, so‘mda"
            testID="entry-amount"
          />
          <Text style={styles.currency}>so‘m</Text>
        </View>
        <Text style={styles.amountHint}>{hint}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Kategoriya</Text>
        <View style={styles.categoryGrid}>
          {categories[kind].map(category=>{
            const selected=category.id===categoryId;
            return <Pressable
              key={category.id}
              accessibilityRole="button"
              accessibilityLabel={category.label}
              accessibilityState={{selected}}
              style={[styles.categoryChip,selected&&styles.categorySelected]}
              onPress={()=>{setCategoryId(category.id);setError(null);}}
            >
              <View style={[styles.categoryIcon,{backgroundColor:category.iconBg}]}>
                <AppIcon name={category.icon} size={18} color={category.iconColor}/>
              </View>
              <Text style={[styles.categoryText,selected&&styles.categoryTextActive]} numberOfLines={1}>{category.label}</Text>
            </Pressable>;
          })}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sana</Text>
        <Pressable
          style={styles.dateField}
          accessibilityRole="button"
          accessibilityLabel="Sanani kalendardan tanlash"
          onPress={()=>setCalendarOpen(true)}
          testID="entry-date"
        >
          <View style={styles.dateIcon}><AppIcon name="receipt" size={19} color={colors.primary}/></View>
          <Text style={styles.dateText}>{formatUzDate(occurredOn)}</Text>
          <AppIcon name="chevron" size={18} color={colors.primary}/>
        </Pressable>
      </View>

      <View style={styles.section}>
        <View style={styles.noteHeading}>
          <Text style={styles.sectionTitle}>Izoh</Text>
          <Text style={styles.optional}>Ixtiyoriy · {note.length}/120</Text>
        </View>
        <TextInput
          value={note}
          onChangeText={value=>setNote(value.slice(0,120))}
          placeholder="Masalan, do‘kondagi xarid"
          placeholderTextColor={colors.faint}
          style={styles.noteInput}
          multiline
          maxLength={120}
          textAlignVertical="top"
          accessibilityLabel="Operatsiyaga izoh"
          testID="entry-note"
        />
      </View>

      <View style={styles.infoCard}>
        <AppIcon name="shield" color={colors.primary} size={20}/>
        <Text style={styles.infoText}>Bu faqat dizayn sinovi. Operatsiya sessiya tarixiga qo‘shiladi, bank yoki Supabase hisobiga yozilmaydi.</Text>
      </View>
    </ScrollView>

    <View style={styles.footer}>
      {error?<Text accessibilityRole="alert" style={styles.errorText}>{error}</Text>:null}
      <Pressable
        onPress={handleSave}
        style={styles.saveButton}
        accessibilityRole="button"
        accessibilityLabel="Namuna operatsiyani saqlash"
        testID="entry-save"
      >
        <AppIcon name="check" color={colors.white} size={19}/>
        <Text style={styles.saveText}>Namuna saqlash</Text>
      </Pressable>
    </View>

    <CalendarSheet
      visible={calendarOpen}
      value={occurredOn}
      todayISO={todayISO}
      onClose={()=>setCalendarOpen(false)}
      onSelect={iso=>{setOccurredOn(iso);setCalendarOpen(false);setError(null);}}
    />
  </KeyboardAvoidingView>;
}

const styles=StyleSheet.create({
  screen:{flex:1,backgroundColor:colors.background},
  header:{paddingHorizontal:spacing.lg,paddingVertical:15,flexDirection:'row',alignItems:'center',gap:12},
  backButton:{height:44,width:44,borderRadius:16,backgroundColor:colors.surface,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:colors.divider},
  headerText:{flex:1},
  kicker:{color:colors.primary,fontSize:9,fontWeight:'800',letterSpacing:1.6},
  pageTitle:{fontSize:23,fontWeight:'800',color:colors.text,marginTop:3,letterSpacing:-0.6},
  demoTag:{backgroundColor:colors.primarySoft,borderRadius:radius.pill,paddingHorizontal:11,paddingVertical:7},
  demoTagText:{fontSize:10,fontWeight:'800',color:colors.primary},
  scroll:{flex:1},
  content:{paddingHorizontal:spacing.lg,paddingBottom:22,gap:19},
  kindSwitch:{flexDirection:'row',backgroundColor:'#EDE2DE',borderRadius:radius.lg,padding:5,gap:5},
  kindOption:{flex:1,minHeight:48,alignItems:'center',justifyContent:'center',borderRadius:radius.md},
  kindActive:{backgroundColor:colors.surface,...shadow.light},
  kindText:{color:colors.muted,fontSize:14,fontWeight:'700'},
  kindTextActive:{color:colors.primary},
  amountCard:{backgroundColor:colors.surface,borderWidth:1,borderColor:colors.divider,borderRadius:radius.xl,padding:20,gap:8},
  fieldLabel:{fontSize:10,color:colors.primary,fontWeight:'800',letterSpacing:1.6},
  moneyRow:{flexDirection:'row',alignItems:'baseline',gap:9},
  moneyInput:{flex:1,minWidth:0,fontSize:40,fontWeight:'800',padding:0,color:colors.text,letterSpacing:-1.5},
  currency:{fontSize:17,fontWeight:'800',color:colors.primary},
  amountHint:{fontSize:11,color:colors.muted},
  section:{gap:10},
  sectionTitle:{fontSize:16,fontWeight:'800',color:colors.text},
  categoryGrid:{flexDirection:'row',flexWrap:'wrap',gap:8},
  categoryChip:{width:'48.4%',minHeight:57,backgroundColor:colors.surface,borderRadius:radius.md,borderWidth:1,borderColor:colors.divider,paddingHorizontal:10,flexDirection:'row',alignItems:'center',gap:8},
  categorySelected:{backgroundColor:colors.primarySoft,borderColor:colors.primary},
  categoryIcon:{height:34,width:34,borderRadius:12,alignItems:'center',justifyContent:'center'},
  categoryText:{flex:1,fontSize:12,color:colors.text,fontWeight:'700'},
  categoryTextActive:{color:colors.primary},
  dateField:{minHeight:59,borderRadius:radius.md,backgroundColor:colors.surface,borderWidth:1,borderColor:colors.divider,paddingHorizontal:13,flexDirection:'row',alignItems:'center',gap:12},
  dateIcon:{height:35,width:35,borderRadius:12,backgroundColor:colors.primarySoft,alignItems:'center',justifyContent:'center'},
  dateText:{fontSize:14,color:colors.text,fontWeight:'700',flex:1},
  noteHeading:{flexDirection:'row',justifyContent:'space-between',alignItems:'center'},
  optional:{fontSize:11,color:colors.faint},
  noteInput:{minHeight:92,borderRadius:radius.md,backgroundColor:colors.surface,borderWidth:1,borderColor:colors.divider,padding:15,fontSize:14,color:colors.text},
  infoCard:{flexDirection:'row',gap:11,alignItems:'flex-start',padding:15,backgroundColor:'#F4E5E1',borderRadius:radius.md},
  infoText:{flex:1,color:colors.muted,fontSize:11,lineHeight:17},
  footer:{paddingHorizontal:spacing.lg,paddingTop:12,paddingBottom:8,borderTopWidth:1,borderColor:colors.divider,backgroundColor:colors.background,gap:8},
  errorText:{fontSize:12,color:colors.negative,fontWeight:'700',paddingHorizontal:4},
  saveButton:{minHeight:56,backgroundColor:colors.primary,borderRadius:radius.lg,alignItems:'center',justifyContent:'center',flexDirection:'row',gap:9},
  saveText:{fontSize:15,fontWeight:'800',color:colors.white},
});
