import { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors, spacing } from '@/constants/theme';
import { IconButton, Notice } from '@/components/ui/Controls';
import { useRestaurant } from '@/hooks/useRestaurant';
interface ScreenProps { children: ReactNode; title?: string; subtitle?: string; back?: boolean; tabs?: boolean; keyboard?: boolean }
export function Screen({ children, title, subtitle, back, tabs, keyboard }: ScreenProps) {
  const router = useRouter(); const { cartCount, storageError } = useRestaurant();
  return <SafeAreaView edges={tabs ? ['top'] : ['top', 'bottom']} style={styles.safe}><KeyboardAvoidingView style={styles.flex} behavior={keyboard ? (Platform.OS === 'ios' ? 'padding' : 'height') : undefined}><View style={styles.container}>{title ? <View style={styles.header}>{back ? <IconButton name="arrow-back" label="Go back" onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)')} /> : null}<View style={styles.heading}><Text style={styles.title}>{title}</Text>{subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}</View><IconButton name="bag-handle-outline" label="Shopping cart" badge={cartCount} onPress={() => router.push('/cart')} /></View> : null}{storageError ? <Notice text={storageError} error /> : null}{children}</View></KeyboardAvoidingView></SafeAreaView>;
}
const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: colors.background }, flex: { flex: 1 }, container: { width: '100%', maxWidth: 960, alignSelf: 'center', flex: 1 }, header: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, flexDirection: 'row', alignItems: 'center', gap: spacing.sm }, heading: { flex: 1 }, title: { fontSize: 24, fontWeight: '800', letterSpacing: -0.6, color: colors.ink }, subtitle: { fontSize: 13, color: colors.subtle, marginTop: 4 } });
