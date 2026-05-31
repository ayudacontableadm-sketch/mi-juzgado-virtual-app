import { StyleSheet, Text, View } from 'react-native';
import { colors, radii, spacing, typography } from '../theme/theme';
export default function ProgressBar({ value, showLabel = true }) { const safe = Math.max(0, Math.min(100, value)); return <View style={styles.row}><View style={styles.track}><View style={[styles.fill, { width: `${safe}%` }]} /></View>{showLabel && <Text style={styles.label}>{safe}%</Text>}</View>; }
const styles = StyleSheet.create({ row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm }, track: { flex: 1, height: 7, backgroundColor: '#E3EAED', borderRadius: radii.pill, overflow: 'hidden' }, fill: { height: '100%', backgroundColor: colors.primary, borderRadius: radii.pill }, label: { ...typography.small, fontWeight: '700', color: colors.ink } });
