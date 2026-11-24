import {useState} from 'react';
import {
  KeyboardAvoidingView,Platform,Pressable,ScrollView,
  StyleSheet,Text,TextInput,View
} from 'react-native';
import {AppIcon,IconName} from '../components/AppIcon';
import {CalendarSheet} from '../components/CalendarSheet';
import {formatUzDate,toLocalISODate} from '../data/calendar';
import {formatMoney} from '../data/demo';
import {
  ACCOUNT_KINDS,AccountDraft,MockAccount,MockGoal,GoalDraft,
  validateAccountDraft,validateGoalDraft,goalPercent
} from '../data/financeSetup';
import {colors,radius,spacing,shadow} from '../theme/tokens';

export type FinanceSection='accounts'|'goals';

type Props={
  section:FinanceSection;
  onBack:()=>void;
  accounts:MockAccount[];
  goals:MockGoal[];
  onAddAccount:(draft:AccountDraft)=>void;
  onAddGoal:(draft:GoalDraft,todayISO:string)=>void;
};

const blankAccount=():AccountDraft=>({name:'',kind:'card',openingBalanceDigits:''});
const blankGoal=():GoalDraft=>({title:'',targetDigits:'',savedDigits:'',dueOn:null});

function InputField({label,value,onChangeText,placeholder,keyboardType='default'}:{
  label:string;
  value:string;
  onChangeText:(text:string)=>void;
  placeholder:string;
  keyboardType?:'default'|'number-pad';
}) {
  return <View style={styles.inputGroup}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <TextInput
      accessibilityLabel={label}
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={colors.faint}
      keyboardType={keyboardType}
      inputMode={keyboardType==='number-pad'?'numeric':'text'}
      selectionColor={colors.primary}
      returnKeyType="done"
    />
  </View>;
}

function RowIcon({name}:{name:IconName}) {
  return <View style={styles.iconContainer}><AppIcon name={name} color={colors.primary} size={22}/></View>;
}

export function FinanceSetupScreen({section,onBack,accounts,goals,onAddAccount,onAddGoal}:Props) {
  const [creating,setCreating]=useState(false);
  const [account,setAccount]=useState<AccountDraft>(blankAccount);
  const [goal,setGoal]=useState<GoalDraft>(blankGoal);
  const [error,setError]=useState<string|null>(null);
  const [calendarOpen,setCalendarOpen]=useState(false);
  const [todayISO]=useState(()=>toLocalISODate(new Date()));
  const [notice,setNotice]=useState('');

  const isAccounts=section==='accounts';
  const title=isAccounts?'Hisoblar':'Maqsadlar';

  function startCreate() {
    setAccount(blankAccount());
    setGoal(blankGoal());
    setError(null);
    setNotice('');
    setCreating(true);
  }

  function cancelCreate(){
    setCalendarOpen(false);
    setCreating(false);
    setError(null);
  }

  function save(){
    if(isAccounts){
      const message=validateAccountDraft(account);
      if(message){setError(message);return;}
      onAddAccount(account);
      setNotice('Namuna hisob qo‘shildi');
    }else{
      const message=validateGoalDraft(goal,todayISO);
      if(message){setError(message);return;}
      onAddGoal(goal,todayISO);
      setNotice('Namuna maqsad qo‘shildi');
    }
    setError(null);
    setCreating(false);
  }

  return <KeyboardAvoidingView style={styles.root} behavior={Platform.OS==='ios'?'padding':undefined}>
    <View style={styles.header}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={creating?'Ro‘yxatga qaytish':'Profilga qaytish'}
        onPress={()=>creating?cancelCreate():onBack()}
        style={styles.backButton}
      ><AppIcon name="arrow-left" color={colors.primary} size={21}/></Pressable>
      <View style={styles.heading}>
        <Text style={styles.eyebrow}>PROFIL · DEMO</Text>
        <Text style={styles.title}>{creating?(isAccounts?'Yangi hisob':'Yangi maqsad'):title}</Text>
      </View>
    </View>

    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.body}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.demoNotice}>
        <AppIcon name="shield" color={colors.primary} size={18}/>
        <Text style={styles.demoNoticeText}>Namuna ma’lumotlar. Haqiqiy bank yoki Supabase hisobiga ulanmagan.</Text>
      </View>

      {creating ? (
        <>
          {isAccounts ? (
            <View style={styles.formCard}>
              <InputField
                label="Hisob nomi"
                value={account.name}
                placeholder="Masalan, asosiy karta"
                onChangeText={name=>{setAccount(a=>({...a,name:name.slice(0,40)}));setError(null);}}
              />
              <Text style={styles.fieldLabel}>Hisob turi</Text>
              <View style={styles.typeRow}>
                {ACCOUNT_KINDS.map(option=>{
                  const selected=account.kind===option.kind;
                  return <Pressable
                    key={option.kind}
                    style={[styles.typeChip,selected&&styles.typeChipSelected]}
                    accessibilityRole="button"
                    accessibilityState={{selected}}
                    onPress={()=>setAccount(a=>({...a,kind:option.kind}))}
                  ><Text style={[styles.typeText,selected&&styles.typeTextSelected]}>{option.label}</Text></Pressable>;
                })}
              </View>
              <InputField
                label="Boshlang‘ich qoldiq (ixtiyoriy)"
                value={account.openingBalanceDigits}
                placeholder="Bo‘sh qoldirish mumkin"
                keyboardType="number-pad"
                onChangeText={openingBalanceDigits=>{setAccount(a=>({...a,openingBalanceDigits}));setError(null);}}
              />
              <Text style={styles.helper}>Bo‘sh — qoldiq noma’lum. 0 — tasdiqlangan nol.</Text>
            </View>
          ) : (
            <View style={styles.formCard}>
              <InputField
                label="Maqsad nomi"
                value={goal.title}
                placeholder="Masalan, noutbuk"
                onChangeText={title=>{setGoal(g=>({...g,title:title.slice(0,50)}));setError(null);}}
              />
              <InputField
                label="Maqsad summasi (so‘m)"
                value={goal.targetDigits}
                placeholder="Masalan, 5 000 000"
                keyboardType="number-pad"
                onChangeText={targetDigits=>{setGoal(g=>({...g,targetDigits}));setError(null);}}
              />
              <InputField
                label="Yig‘ilgan pul (ixtiyoriy)"
                value={goal.savedDigits}
                placeholder="0"
                keyboardType="number-pad"
                onChangeText={savedDigits=>{setGoal(g=>({...g,savedDigits}));setError(null);}}
              />
              <View style={styles.deadlineHeader}>
                <Text style={styles.fieldLabel}>Muddati (ixtiyoriy)</Text>
                {goal.dueOn!==null
                  ? <Pressable accessibilityRole="button" onPress={()=>setGoal(g=>({...g,dueOn:null}))}>
                      <Text style={styles.removeDeadline}>Olib tashlash</Text>
                    </Pressable>
                  : null}
              </View>
              <Pressable
                style={styles.dateButton}
                accessibilityRole="button"
                accessibilityLabel="Maqsad muddatini tanlash"
                onPress={()=>setCalendarOpen(true)}
              >
                <AppIcon name="receipt" color={colors.primary} size={19}/>
                <Text style={styles.dateText}>{goal.dueOn?formatUzDate(goal.dueOn):'Muddatsiz'}</Text>
                <AppIcon name="chevron" color={colors.primary} size={18}/>
              </Pressable>
            </View>
          )}
          {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
          <Pressable accessibilityRole="button" style={styles.primaryButton} onPress={save}>
            <AppIcon name="check" color={colors.white} size={20}/>
            <Text style={styles.primaryText}>Namuna saqlash</Text>
          </Pressable>
          <Pressable accessibilityRole="button" style={styles.secondaryButton} onPress={cancelCreate}>
            <Text style={styles.secondaryText}>Bekor qilish</Text>
          </Pressable>
        </>
      ) : (
        <>
          {notice ? <View style={styles.notice}>
            <AppIcon name="check" color={colors.positive} size={18}/>
            <Text style={styles.noticeText}>{notice}</Text>
          </View> : null}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryEyebrow}>{isAccounts?'HISOBLAR':'MAQSADLAR'}</Text>
            <Text style={styles.summaryNumber}>{isAccounts?accounts.length:goals.length}</Text>
            <Text style={styles.summaryFoot}>{isAccounts?'Hisob mavjud':'Maqsad rejalashtirilgan'} · namuna</Text>
          </View>

          <View style={styles.listHeading}>
            <Text style={styles.sectionTitle}>{isAccounts?'Hisoblar ro‘yxati':'Maqsadlar rejangiz'}</Text>
            <Pressable accessibilityRole="button" accessibilityLabel={isAccounts?'Hisob qo‘shish':'Maqsad qo‘shish'} style={styles.smallAdd} onPress={startCreate}>
              <AppIcon name="plus" color={colors.white} size={17}/>
              <Text style={styles.smallAddText}>Qo‘shish</Text>
            </Pressable>
          </View>

          {isAccounts ? (
            accounts.length===0
              ? <View style={styles.empty}><Text style={styles.emptyTitle}>Hali hisob yo‘q</Text><Text style={styles.emptyBody}>Birinchi hisobni qo‘shing.</Text></View>
              : accounts.map(item=><View key={item.id} style={styles.itemCard}>
                  <RowIcon name={item.kind==='cash'?'wallet':item.kind==='savings'?'shield':'receipt'}/>
                  <View style={styles.itemBody}>
                    <Text style={styles.itemTitle}>{item.name}</Text>
                    <Text style={styles.itemSubtitle}>{ACCOUNT_KINDS.find(k=>k.kind===item.kind)?.label} · namuna</Text>
                  </View>
                  <Text style={[styles.itemAmount,item.openingBalanceUzs===null&&styles.unknown]} numberOfLines={2}>
                    {item.openingBalanceUzs===null?'Noma’lum':formatMoney(item.openingBalanceUzs)}
                  </Text>
                </View>)
          ) : (
            goals.length===0
              ? <View style={styles.empty}><Text style={styles.emptyTitle}>Hali maqsad yo‘q</Text><Text style={styles.emptyBody}>Birinchi moliyaviy maqsadni yarating.</Text></View>
              : goals.map(item=>{
                const percent=goalPercent(item);
                return <View key={item.id} style={styles.goalCard}>
                  <View style={styles.goalTop}>
                    <View style={{flex:1}}>
                      <Text style={styles.itemTitle}>{item.title}</Text>
                      <Text style={styles.itemSubtitle}>{item.dueOn?formatUzDate(item.dueOn):'Muddatsiz'}</Text>
                    </View>
                    <Text style={styles.progressPercent}>{percent}%</Text>
                  </View>
                  <View style={styles.progressBg}>
                    <View style={[styles.progressFill,{width:`${percent}%` as `${number}%`}]}/>
                  </View>
                  <Text style={styles.goalAmount}>{formatMoney(item.savedUzs)} / {formatMoney(item.targetUzs)}</Text>
                </View>;
              })
          )}
          <Text style={styles.disclaimer}>Ushbu ko‘rsatkichlar moliyaviy hisob-kitob emas, faqat UI namunasi.</Text>
        </>
      )}
    </ScrollView>

    <CalendarSheet
      visible={calendarOpen}
      mode="future"
      value={goal.dueOn??todayISO}
      todayISO={todayISO}
      onClose={()=>setCalendarOpen(false)}
      onSelect={iso=>{setGoal(g=>({...g,dueOn:iso}));setCalendarOpen(false);setError(null);}}
    />
  </KeyboardAvoidingView>;
}

const styles=StyleSheet.create({
  root:{flex:1,backgroundColor:colors.background},
  header:{flexDirection:'row',alignItems:'center',gap:12,paddingHorizontal:spacing.lg,paddingTop:15,paddingBottom:18},
  backButton:{width:44,height:44,borderRadius:15,backgroundColor:colors.surface,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:colors.divider},
  heading:{flex:1},
  eyebrow:{fontSize:10,fontWeight:'800',letterSpacing:1.5,color:colors.primary},
  title:{fontSize:25,fontWeight:'800',color:colors.text,letterSpacing:-0.5,marginTop:4},
  scroll:{flex:1},body:{paddingHorizontal:spacing.lg,paddingBottom:38,gap:16},
  demoNotice:{padding:14,borderRadius:radius.lg,backgroundColor:'#F2E5E3',flexDirection:'row',gap:10,alignItems:'center'},
  demoNoticeText:{fontSize:11,color:colors.muted,lineHeight:17,flex:1},
  summaryCard:{backgroundColor:colors.primary,borderRadius:radius.xl,padding:20,minHeight:144,...shadow.light},
  summaryEyebrow:{color:'#F2DDE4',letterSpacing:1.6,fontWeight:'800',fontSize:10},
  summaryNumber:{color:colors.white,fontWeight:'800',fontSize:38,marginTop:9},
  summaryFoot:{color:'#EAC8D5',fontSize:11,marginTop:2},
  listHeading:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:10},
  sectionTitle:{fontSize:17,fontWeight:'800',color:colors.text,flex:1},
  smallAdd:{minHeight:44,borderRadius:radius.md,backgroundColor:colors.primary,flexDirection:'row',gap:5,alignItems:'center',paddingHorizontal:13},
  smallAddText:{color:colors.white,fontSize:12,fontWeight:'800'},
  itemCard:{backgroundColor:colors.surface,borderRadius:radius.lg,borderWidth:1,borderColor:colors.divider,padding:13,flexDirection:'row',alignItems:'center',gap:11},
  iconContainer:{height:45,width:45,borderRadius:15,backgroundColor:colors.primarySoft,alignItems:'center',justifyContent:'center'},
  itemBody:{flex:1,minWidth:0,gap:5},
  itemTitle:{fontSize:14,fontWeight:'800',color:colors.text},
  itemSubtitle:{fontSize:10,color:colors.muted},
  itemAmount:{fontSize:12,fontWeight:'800',color:colors.primary,maxWidth:130,textAlign:'right',flexShrink:1},
  unknown:{fontSize:11,color:colors.faint},
  goalCard:{backgroundColor:colors.surface,borderRadius:radius.lg,borderWidth:1,borderColor:colors.divider,padding:16,gap:12},
  goalTop:{flexDirection:'row',alignItems:'center',gap:9},
  progressPercent:{fontSize:18,fontWeight:'800',color:colors.primary},
  progressBg:{height:8,borderRadius:radius.pill,backgroundColor:'#EDDFE2',overflow:'hidden'},
  progressFill:{height:'100%',borderRadius:radius.pill,backgroundColor:colors.primary},
  goalAmount:{fontSize:12,fontWeight:'700',color:colors.muted},
  formCard:{backgroundColor:colors.surface,borderRadius:radius.xl,borderWidth:1,borderColor:colors.divider,padding:17,gap:16},
  inputGroup:{gap:8},
  fieldLabel:{fontSize:11,color:colors.primary,fontWeight:'800',letterSpacing:0.3},
  input:{borderWidth:1,borderColor:colors.line,borderRadius:radius.md,minHeight:50,paddingHorizontal:13,fontSize:15,color:colors.text,backgroundColor:'#FFFEFC'},
  typeRow:{flexDirection:'row',gap:6},
  typeChip:{flex:1,minHeight:46,paddingHorizontal:5,borderRadius:radius.md,alignItems:'center',justifyContent:'center',backgroundColor:colors.background},
  typeChipSelected:{backgroundColor:colors.primarySoft,borderWidth:1,borderColor:colors.primary},
  typeText:{color:colors.muted,fontWeight:'700',fontSize:12},
  typeTextSelected:{color:colors.primary},
  helper:{fontSize:11,color:colors.muted,lineHeight:17},
  deadlineHeader:{flexDirection:'row',justifyContent:'space-between',alignItems:'center'},
  removeDeadline:{fontSize:11,color:colors.primary,fontWeight:'800',padding:7},
  dateButton:{minHeight:51,borderWidth:1,borderColor:colors.line,borderRadius:radius.md,flexDirection:'row',gap:10,alignItems:'center',paddingHorizontal:12},
  dateText:{flex:1,fontSize:13,color:colors.text,fontWeight:'700'},
  error:{fontSize:12,color:colors.negative,fontWeight:'700'},
  primaryButton:{minHeight:56,backgroundColor:colors.primary,borderRadius:radius.lg,alignItems:'center',justifyContent:'center',flexDirection:'row',gap:9},
  primaryText:{fontSize:14,color:colors.white,fontWeight:'800'},
  secondaryButton:{minHeight:48,alignItems:'center',justifyContent:'center'},
  secondaryText:{fontSize:13,color:colors.muted,fontWeight:'700'},
  notice:{padding:12,flexDirection:'row',gap:9,alignItems:'center',backgroundColor:'#E6F2EA',borderRadius:radius.md},
  noticeText:{fontSize:11,color:colors.positive,flex:1},
  empty:{backgroundColor:colors.surface,borderRadius:radius.lg,alignItems:'center',justifyContent:'center',minHeight:150,padding:16,gap:7},
  emptyTitle:{fontSize:15,fontWeight:'800',color:colors.text},
  emptyBody:{fontSize:12,color:colors.muted},
  disclaimer:{fontSize:10,color:colors.faint,textAlign:'center',lineHeight:16},
});
