import {Pressable, StyleSheet, Text} from 'react-native';
import {colors, layout, semantic, typography} from '../../theme/tokens';

type Props = {
  label: string;
  active: boolean;
  onPress: () => void;
  accessibilityLabel?: string;
  flex?: boolean;
};

export function ChoiceChip({label, active, onPress, accessibilityLabel, flex = false}: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{selected: active}}
      onPress={onPress}
      style={[styles.chip, flex && styles.flex, active && styles.active]}
    >
      <Text style={[styles.text, active && styles.activeText]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    minHeight: layout.touchTarget, minWidth: 74, paddingHorizontal: 12,
    borderRadius: 11, backgroundColor: semantic.inactiveControl,
    alignItems: 'center', justifyContent: 'center',
  },
  flex: {flex: 1, minWidth: 0},
  active: {backgroundColor: semantic.activeControl},
  text: {fontSize: typography.size.caption, fontWeight: typography.weight.bold, color: colors.muted},
  activeText: {color: colors.text},
});
