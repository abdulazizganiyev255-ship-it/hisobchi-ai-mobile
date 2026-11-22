import {Pressable, StyleSheet, Text, View} from 'react-native';
import {AppIcon} from '../AppIcon';
import {colors, layout, radius, semantic, typography} from '../../theme/tokens';

type Props = {
  title: string;
  subtitle: string;
  onBack: () => void;
  backLabel?: string;
};

export function FormHeader({title, subtitle, onBack, backLabel = 'Orqaga qaytish'}: Props) {
  return (
    <View style={styles.root}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={backLabel}
        onPress={onBack}
        style={styles.back}
      >
        <AppIcon name="arrow-left" color={colors.primarySoft} size={21}/>
      </Pressable>
      <View style={styles.copy}>
        <Text accessibilityRole="header" numberOfLines={2} style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {flexDirection: 'row', alignItems: 'center', gap: layout.inlineGap},
  back: {
    minWidth: layout.touchTarget, minHeight: layout.touchTarget,
    borderRadius: radius.sm, backgroundColor: semantic.darkPanel,
    alignItems: 'center', justifyContent: 'center',
  },
  copy: {flex: 1, minWidth: 0},
  title: {color: colors.text, fontSize: 20, fontWeight: typography.weight.heavy, letterSpacing: -0.35},
  subtitle: {color: semantic.darkSubtext, fontSize: typography.size.caption, marginTop: 3},
});
