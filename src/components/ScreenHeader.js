import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '../theme/theme';

export default function ScreenHeader({ navigation, title, subtitle, right }) {
  return <SafeAreaView edges={['top', 'right', 'left']} style={styles.safeArea}>
    <View style={styles.header}>
      <Pressable onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back" size={25} color={colors.ink} />
      </Pressable>
      <View style={styles.center}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      <View style={styles.right}>{right}</View>
    </View>
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: colors.white },
  header: { minHeight: 64, paddingHorizontal: spacing.lg, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: colors.border },
  center: { flex: 1, alignItems: 'center' },
  title: { ...typography.h3, color: colors.ink },
  subtitle: { ...typography.tiny, color: colors.muted },
  right: { minWidth: 25, alignItems: 'flex-end' },
});
