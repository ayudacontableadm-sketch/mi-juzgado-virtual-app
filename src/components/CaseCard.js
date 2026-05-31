import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppCard from './AppCard';
import ProgressBar from './ProgressBar';
import { colors, spacing, typography } from '../theme/theme';
export default function CaseCard({ item, onPress }) { return <Pressable onPress={onPress}><AppCard><View style={styles.row}><View style={styles.content}><Text style={styles.title}>{item.title}</Text><Text style={styles.meta}>Última sesión: {item.lastSession}</Text><ProgressBar value={item.progress} /></View><Ionicons name="chevron-forward" size={20} color={colors.primary} /></View></AppCard></Pressable>; }
const styles = StyleSheet.create({ row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md }, content: { flex: 1, gap: spacing.sm }, title: { ...typography.h3, color: colors.ink }, meta: { ...typography.small, color: colors.muted } });
