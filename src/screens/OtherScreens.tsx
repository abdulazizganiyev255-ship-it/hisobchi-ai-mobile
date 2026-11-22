import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {AppIcon} from '../components/AppIcon';
import {colors, radius} from '../theme/tokens';

export type Tab = 'home' | 'transactions' | 'analytics' | 'profile';

export function OtherScreen({tab: _tab}: {tab: 'profile'}) {
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.icon}>
          <AppIcon name="user" color={colors.primary} size={23}/>
        </View>
        <View style={{flex: 1}}>
          <Text style={styles.title}>Profil</Text>
          <Text style={styles.caption}>Hisobchi AI · Namoyish rejimi</Text>
        </View>
      </View>
      <View style={styles.darkCard}>
        <Text style={styles.section}>Dizayn prototipi v0.6</Text>
        <Text style={styles.note}>
          Operatsiyalarni qo‘shish, tahrirlash va o‘chirish hozir faqat sessiya
          xotirasida ishlaydi. Sahifani yangilaganda demo ma’lumotlar qaytadi.
          Hisobga kirish, bank integratsiyasi va AI tahlili hozircha yoqilmagan.
        </Text>
        <View style={styles.profileLine}>
          <AppIcon name="shield" size={19} color={colors.positive}/>
          <Text style={styles.profileText}>Haqiqiy moliyaviy ma’lumotlar ishlatilmaydi</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {padding: 20, paddingTop: 26, paddingBottom: 36, gap: 24},
  header: {flexDirection: 'row', alignItems: 'center', gap: 12},
  icon: {height: 50, width: 50, borderRadius: 16, backgroundColor: colors.surface, justifyContent: 'center', alignItems: 'center'},
  title: {fontSize: 24, fontWeight: '800', color: colors.text},
  caption: {color: colors.muted, fontSize: 12, marginTop: 3},
  darkCard: {backgroundColor: colors.surface, borderRadius: radius.lg, padding: 20, borderColor: colors.divider, borderWidth: 1},
  section: {fontSize: 15, color: colors.text, fontWeight: '700'},
  note: {color: colors.muted, fontSize: 13, lineHeight: 21, marginTop: 15},
  profileLine: {marginTop: 22, flexDirection: 'row', gap: 8, alignItems: 'center'},
  profileText: {fontSize: 12, color: colors.positive, flex: 1},
});
