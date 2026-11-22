import type {ReactNode} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {AppIcon, type IconName} from '../AppIcon';
import {colors, layout, radius, semantic, typography} from '../../theme/tokens';

type Props = {
  icon: IconName;
  title: string;
  subtitle?: string;
  trailing?: ReactNode;
  tone?: 'dark' | 'light';
};

export function SectionHeader({icon, title, subtitle, trailing, tone = 'dark'}: Props) {
  const light = tone === 'light';
  return (
    <View style={styles.root}>
      <View style={[styles.icon, light && styles.lightIcon]}>
        <AppIcon name={icon} color={light ? '#12698C' : colors.primary} size={18}/>
      </View>
      <View style={styles.content}>
        <Text accessibilityRole="header" style={[styles.title, light && styles.lightTitle]}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={[styles.subtitle, light && styles.lightSubtitle]}>{subtitle}</Text>
        ) : null}
      </View>
      {trailing}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {flexDirection: 'row', alignItems: 'center', gap: layout.inlineGap},
  icon: {
    width: 34, height: 34, borderRadius: radius.sm,
    backgroundColor: semantic.sectionIconDark,
    alignItems: 'center', justifyContent: 'center',
  },
  lightIcon: {backgroundColor: semantic.sectionIconLight},
  content: {flex: 1, minWidth: 0},
  title: {color: colors.text, fontSize: typography.size.section, fontWeight: typography.weight.heavy},
  lightTitle: {color: semantic.lightText},
  subtitle: {fontSize: typography.size.caption, color: colors.muted, marginTop: 3},
  lightSubtitle: {color: semantic.lightSubtext},
});
