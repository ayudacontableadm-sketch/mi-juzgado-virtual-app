import { StyleSheet, View } from 'react-native';
import { colors, radii, shadows, spacing } from '../theme/theme';
export default function AppCard({ children, style }) { return <View style={[styles.card, style]}>{children}</View>; }
const styles = StyleSheet.create({ card: { backgroundColor: colors.white, borderColor: colors.border, borderRadius: radii.lg, borderWidth: 1, padding: spacing.lg, ...shadows.card } });
