import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '../theme/theme';

const tabs = [['Inicio', 'home', 'Dashboard'], ['Mis juicios', 'folder-open-outline'], ['Estadísticas', 'stats-chart-outline'], ['Perfil', 'person-outline', 'Profile']];

export default function BottomTabs({ navigation, active = 'Inicio' }) {
  return <SafeAreaView edges={['right', 'bottom', 'left']} style={styles.safeArea}>
    <View style={styles.bar}>
      {tabs.map(([label, icon, route]) => <Pressable key={label} onPress={() => route && navigation.navigate(route)} style={styles.tab}>
        <Ionicons name={icon} size={20} color={active === label ? colors.primary : colors.muted} />
        <Text style={[styles.label, active === label && styles.active]}>{label}</Text>
      </Pressable>)}
    </View>
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: colors.white, borderTopWidth: 1, borderTopColor: colors.border },
  bar: { flexDirection: 'row', paddingVertical: spacing.sm },
  tab: { flex: 1, alignItems: 'center', gap: 3 },
  label: { ...typography.tiny, color: colors.muted },
  active: { color: colors.primary, fontWeight: '800' },
});
