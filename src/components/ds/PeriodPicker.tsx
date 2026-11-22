import {useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {AppIcon} from '../AppIcon';
import {ChoiceChip} from './ChoiceChip';
import {colors, layout, radius, semantic, typography} from '../../theme/tokens';

type Option<K extends string> = {key: K; label: string};

type Props<K extends string> = {
  value: K;
  options: ReadonlyArray<Option<K>>;
  description?: string;
  onChange: (value: K) => void;
};

export function PeriodPicker<K extends string>({value, options, description, onChange}: Props<K>) {
  const [expanded, setExpanded] = useState(false);
  const selected = options.find(option => option.key === value)?.label ?? value;

  return (
    <View style={styles.container}>
      <View style={styles.line}>
        <Pressable
          onPress={() => setExpanded(current => !current)}
          accessibilityRole="button"
          accessibilityLabel={'Muddatni tanlash. Hozir: ' + selected}
          accessibilityState={{expanded}}
          style={[styles.trigger, expanded && styles.triggerOpen]}
        >
          <Text style={styles.triggerText}>{selected}</Text>
          <AppIcon name="chevron-down" size={15} color={colors.primarySoft}/>
        </Pressable>
        {description ? <Text style={styles.description} numberOfLines={1}>{description}</Text> : null}
      </View>
      {expanded ? (
        <View style={styles.menu}>
          {options.map(option => (
            <ChoiceChip
              key={option.key}
              label={option.label}
              active={value === option.key}
              accessibilityLabel={'Tahlil davri: ' + option.label}
              onPress={() => {
                onChange(option.key);
                setExpanded(false);
              }}
              flex
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {gap: 8},
  line: {flexDirection: 'row', alignItems: 'center', gap: 10},
  trigger: {
    minHeight: layout.touchTarget, minWidth: 108, paddingHorizontal: 12,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderRadius: radius.sm, borderWidth: 1, borderColor: colors.divider,
    backgroundColor: semantic.darkPanel, gap: 8,
  },
  triggerOpen: {borderColor: semantic.focusBorder},
  triggerText: {color: colors.text, fontSize: typography.size.caption, fontWeight: typography.weight.bold},
  description: {color: colors.muted, fontSize: typography.size.caption, flex: 1, textAlign: 'right'},
  menu: {flexDirection: 'row', flexWrap: 'wrap', gap: 7, padding: 7, borderRadius: radius.md, backgroundColor: semantic.darkPanel},
});
