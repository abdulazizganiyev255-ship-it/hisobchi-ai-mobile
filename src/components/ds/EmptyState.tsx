import {Pressable, StyleSheet, Text, View} from 'react-native';
import {AppIcon, type IconName} from '../AppIcon';
import {colors, layout, radius, semantic, typography} from '../../theme/tokens';

type Props = {
  icon?: IconName;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  tone?: 'dark' | 'light';
};

/** Truthful empty state with an optional *working* action, never a fake loading state. */
export function EmptyState({
  icon = 'receipt', title, description, actionLabel, onAction, tone = 'dark',
}: Props) {
  const light = tone === 'light';
  return (
    <View style={[styles.root, light && styles.light]}>
      <View style={[styles.icon, light && styles.lightIcon]}>
        <AppIcon name={icon} color={light ? colors.ink : colors.primarySoft} size={24}/>
      </View>
      <Text accessibilityRole="header" style={[styles.title, light && styles.lightTitle]}>{title}</Text>
      <Text style={[styles.body, light && styles.lightBody]}>{description}</Text>
      {actionLabel && onAction ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
          onPress={onAction}
          style={[styles.action, light && styles.lightAction]}
        >
          <Text style={[styles.actionText, light && styles.lightActionText]}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {alignItems: 'center', justifyContent: 'center', padding: 20, gap: 9},
  light: {padding: 18},
  icon: {
    width: 48, height: 48, borderRadius: radius.md, backgroundColor: semantic.sectionIconDark,
    justifyContent: 'center', alignItems: 'center',
  },
  lightIcon: {backgroundColor: semantic.sectionIconLight},
  title: {fontSize: typography.size.section, fontWeight: typography.weight.heavy, color: colors.text, textAlign: 'center'},
  lightTitle: {color: semantic.lightText},
  body: {
    fontSize: typography.size.caption, lineHeight: typography.lineHeight.caption,
    color: semantic.darkSubtext, textAlign: 'center',
  },
  lightBody: {color: semantic.lightSubtext},
  action: {
    minHeight: layout.touchTarget, marginTop: 5, paddingHorizontal: 17, borderRadius: radius.sm,
    backgroundColor: colors.surfaceRaised, justifyContent: 'center', alignItems: 'center',
  },
  lightAction: {backgroundColor: '#CBE6F7'},
  actionText: {fontSize: typography.size.label, color: colors.primarySoft, fontWeight: typography.weight.bold},
  lightActionText: {color: semantic.lightText},
});
