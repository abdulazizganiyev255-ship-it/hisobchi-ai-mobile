import {Pressable, StyleSheet, Text, View} from 'react-native';
import {AppIcon, type IconName} from '../AppIcon';
import {colors, layout, radius, semantic, typography} from '../../theme/tokens';

type Props = {
  icon: IconName;
  title: string;
  subtitle?: string;
  onPress: () => void;
  accessibilityLabel?: string;
};

export function ActionRow({icon, title, subtitle, onPress, accessibilityLabel}: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      onPress={onPress}
      style={styles.root}
    >
      <View style={styles.icon}>
        <AppIcon name={icon} color={colors.primarySoft} size={19}/>
      </View>
      <View style={styles.copy}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      <AppIcon name="chevron" color={colors.muted} size={17}/>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    minHeight: 58, flexDirection: 'row', alignItems: 'center',
    paddingVertical: 8, gap: layout.inlineGap,
  },
  icon: {
    width: layout.touchTarget, height: layout.touchTarget, borderRadius: radius.sm,
    backgroundColor: semantic.sectionIconDark, alignItems: 'center', justifyContent: 'center',
  },
  copy: {flex: 1, minWidth: 0, gap: 3},
  title: {fontSize: typography.size.body, fontWeight: typography.weight.bold, color: colors.text},
  subtitle: {fontSize: typography.size.caption, lineHeight: typography.lineHeight.caption, color: colors.muted},
});
