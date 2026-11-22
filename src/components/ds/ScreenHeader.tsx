import type {ReactNode} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {AppIcon, type IconName} from '../AppIcon';
import {colors, layout, radius, semantic, typography} from '../../theme/tokens';

type Props = {
  title: string;
  subtitle?: string;
  icon: IconName;
  trailing?: ReactNode;
};

export function ScreenHeader({title, subtitle, icon, trailing}: Props) {
  return (
    <View style={styles.root}>
      <View style={styles.icon}>
        <AppIcon name={icon} color={colors.primarySoft} size={23}/>
      </View>
      <View style={styles.text}>
        <Text accessibilityRole="header" style={styles.title} numberOfLines={1} adjustsFontSizeToFit>
          {title}
        </Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {trailing}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {flexDirection: 'row', alignItems: 'center', gap: layout.inlineGap},
  icon: {
    height: layout.touchTarget, width: layout.touchTarget,
    borderRadius: radius.sm, backgroundColor: semantic.darkPanel,
    alignItems: 'center', justifyContent: 'center',
  },
  text: {flex: 1, minWidth: 0},
  title: {
    fontSize: typography.size.page, lineHeight: typography.lineHeight.page,
    color: colors.text, fontWeight: typography.weight.heavy, letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: typography.size.caption, lineHeight: typography.lineHeight.caption,
    color: semantic.darkSubtext, marginTop: 2,
  },
});
