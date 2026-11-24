import {useEffect,useRef,useState} from 'react';
import {BackHandler,Modal,Platform,Pressable,StyleSheet,Text,View} from 'react-native';
import {SafeAreaProvider,SafeAreaView} from 'react-native-safe-area-context';
import {StatusBar} from 'expo-status-bar';
import {AppIcon,type IconName} from '../components/AppIcon';
import {type Transaction} from '../data/demo';
import {transactionFromDraft,type TransactionDraft,type TransactionKind} from '../data/transactions';
import {Overview} from './Overview';
import {Activity} from './Activity';
import {Analysis} from './Analysis';
import {Profile} from './Profile';
import {Entry} from './Entry';
import {sampleItems} from './finance';
import {T} from './theme';
import {Eyebrow} from './UI';

type Tab='home'|'activity'|'analysis'|'profile';
const tabs:{key:Tab;label:string;icon:IconName}[]=[
  {key:'home',label:'Bosh sahifa',icon:'home'},
  {key:'activity',label:'Faoliyat',icon:'receipt'},
  {key:'analysis',label:'Tahlil',icon:'chart'},
  {key:'profile',label:'Profil',icon:'user'},
];
type EditorState='new'|Transaction|null;

function Workspace(){
  const [tab,setTab]=useState<Tab>('home');
  const [records,setRecords]=useState<Transaction[]>(sampleItems);
  const [editor,setEditor]=useState<EditorState>(null);
  const [newKind,setNewKind]=useState<TransactionKind>('expense');
  const [safeInfo,setSafeInfo]=useState(false);
  const nextId=useRef(1000);

  const begin=(kind:TransactionKind)=>{setNewKind(kind);setEditor('new');};
  const save=(draft:TransactionDraft)=>{
    if(editor===null)return;
    const original=editor==='new'?undefined:editor;
    const id=original?.id??'session-'+String(nextId.current++);
    const created=transactionFromDraft(draft,id,original);
    setRecords(old=>original?old.map(x=>x.id===id?created:x):[created,...old]);
    setEditor(null);setTab('activity');
  };
  const remove=()=>{
    if(editor===null||editor==='new')return;
    const id=editor.id;
    setRecords(old=>old.filter(x=>x.id!==id));
    setEditor(null);setTab('activity');
  };
  const reset=()=>{
    setRecords(sampleItems());nextId.current=1000;setTab('home');
  };
  useEffect(()=>{
    if(Platform.OS!=='android')return;
    const listener=BackHandler.addEventListener('hardwareBackPress',()=>{
      if(safeInfo){setSafeInfo(false);return true;}
      if(editor!==null){setEditor(null);return true;}
      if(tab!=='home'){setTab('home');return true;}
      return false;
    });
    return ()=>listener.remove();
  },[tab,editor,safeInfo]);

  return (
    <SafeAreaView style={s.safe} edges={['top','bottom']}>
      <StatusBar style="dark"/>
      <View style={s.body}>
        {editor!==null?(
          <Entry key={editor==='new'?'create':editor.id}
            kind={newKind}
            initial={editor==='new'?undefined:editor}
            onCancel={()=>setEditor(null)}
            onSave={save} onDelete={remove}/>
        ):tab==='home'?(
          <Overview items={records} onExpense={()=>begin('expense')}
            onIncome={()=>begin('income')} onActivity={()=>setTab('activity')}
            onEdit={setEditor} onSafeInfo={()=>setSafeInfo(true)}/>
        ):tab==='activity'?(
          <Activity items={records} onAdd={()=>begin('expense')} onEdit={setEditor}/>
        ):tab==='analysis'?(
          <Analysis items={records} onActivity={()=>setTab('activity')}/>
        ):(
          <Profile items={records} onReset={reset}/>
        )}
      </View>
      {editor===null?(
        <View style={s.nav} accessibilityRole="tablist" testID="reboot-bottom-nav">
          {tabs.map(item=>{
            const active=tab===item.key;
            return (
              <Pressable key={item.key} accessibilityRole="tab"
                accessibilityLabel={item.label}
                accessibilityState={{selected:active}}
                onPress={()=>setTab(item.key)}
                style={({pressed})=>[s.tab,pressed&&{opacity:.72}]}>
                <View style={[s.tabIndicator,active&&s.tabIndicatorActive]}/>
                <AppIcon name={item.icon} size={21} color={active?T.cobalt:T.muted}/>
                <Text numberOfLines={1} style={[s.tabText,active&&s.tabTextActive]}>{item.label}</Text>
              </Pressable>
            );
          })}
        </View>
      ):null}
      <Modal transparent visible={safeInfo} animationType="fade"
        onRequestClose={()=>setSafeInfo(false)}>
        <View style={s.modalBackdrop}>
          <View style={s.modalCard} testID="reboot-safe-modal">
            <Eyebrow>HISOBCHI · MANBA ANIQLIGI</Eyebrow>
            <Text style={s.modalTitle}>Xavfsiz sarflash qanday hisoblanadi?</Text>
            <Text style={s.modalText}>
              Bu ko‘rsatkich uchun haqiqiy hisoblar, daromad, majburiy to‘lovlar va
              ajratilgan mablag‘lar kerak. Hozir ular ulanmagani sababli summa
              chiqarilmaydi.
            </Text>
            <Text style={s.modalText}>
              Siz hozir kiritadigan operatsiyalar faqat shu sessiyaning Kirim,
              Chiqim va Tahlil qiymatlarini yangilaydi.
            </Text>
            <Pressable accessibilityRole="button" testID="reboot-safe-close"
              onPress={()=>setSafeInfo(false)} style={s.modalButton}>
              <Text style={s.modalButtonText}>Tushunarli</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

export default function RebootApp(){
  return <SafeAreaProvider><Workspace/></SafeAreaProvider>;
}
const s=StyleSheet.create({
  safe:{flex:1,backgroundColor:T.canvas},
  body:{flex:1,minHeight:0},
  nav:{flexDirection:'row',backgroundColor:T.paper,borderTopWidth:1,borderTopColor:T.border,paddingTop:4,paddingBottom:4},
  tab:{flex:1,minWidth:0,minHeight:62,alignItems:'center',justifyContent:'center',gap:5},
  tabIndicator:{position:'absolute',top:0,width:31,height:3,borderRadius:2,backgroundColor:'transparent'},
  tabIndicatorActive:{backgroundColor:T.cobalt},
  tabText:{fontSize:10,fontWeight:'700',color:T.muted},
  tabTextActive:{color:T.cobalt,fontWeight:'900'},
  modalBackdrop:{flex:1,backgroundColor:'rgba(14,22,35,.59)',justifyContent:'center',padding:24},
  modalCard:{backgroundColor:T.paper,borderRadius:17,padding:23,gap:12},
  modalTitle:{fontSize:22,color:T.ink,fontWeight:'900',letterSpacing:-.7},
  modalText:{color:T.muted,fontSize:13,lineHeight:21},
  modalButton:{backgroundColor:T.cobalt,minHeight:51,borderRadius:11,justifyContent:'center',alignItems:'center',marginTop:5},
  modalButtonText:{color:T.white,fontWeight:'900',fontSize:14},
});
