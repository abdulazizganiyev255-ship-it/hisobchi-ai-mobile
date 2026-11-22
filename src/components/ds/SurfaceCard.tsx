import type {ReactNode} from 'react';
import {StyleSheet, View, type StyleProp, type ViewStyle} from 'react-native';
import {colors, radius, semantic} from '../../theme/tokens';

type Props = {
  children: ReactNode;
  tone?: 'dark' | 'light';
  style?: StyleProp<ViewStyle>;
};

export function SurfaceCard({children, tone = 'dark', style}: Props) {
  return (
    <View style={[styles.base, tone === 'light' ? styles.light : styles.dark, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {borderWidth: 1, borderRadius: radius.lg, padding: 15},
  dark: {backgroundColor: semantic.darkPanel, borderColor: colors.divider},
  light: {backgroundColor: semantic.lightPanel, borderColor: 'transparent', padding: 16},
});
