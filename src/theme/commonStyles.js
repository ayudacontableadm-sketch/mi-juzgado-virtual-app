import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from './theme';
export const commonStyles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.white },
  scrollContent: { padding: spacing.lg, paddingBottom: 100 },
  title: { ...typography.h1, color: colors.ink },
  sectionTitle: { ...typography.h3, color: colors.ink, marginTop: spacing.xl, marginBottom: spacing.md },
  body: { ...typography.body, color: colors.text },
  muted: { ...typography.small, color: colors.muted },
});
