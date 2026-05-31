import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { colors, radii, spacing, typography } from '../theme/theme';
export default function AppButton({ title, onPress, variant = 'primary', loading = false, disabled = false, style }) {
  const secondary = variant === 'secondary';
  return <Pressable accessibilityRole="button" disabled={disabled || loading} onPress={onPress} style={({ pressed }) => [styles.base, secondary ? styles.secondary : styles.primary, (pressed || disabled) && styles.dimmed, style]}>
    {loading ? <ActivityIndicator color={secondary ? colors.primary : colors.white} /> : <Text style={[styles.label, secondary && styles.secondaryLabel]}>{title}</Text>}
  </Pressable>;
}
const styles = StyleSheet.create({
  base: { minHeight: 52, borderRadius: radii.pill, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.lg },
  primary: { backgroundColor: colors.primary }, secondary: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.primary },
  label: { ...typography.h3, color: colors.white }, secondaryLabel: { color: colors.primary }, dimmed: { opacity: 0.68 },
});
