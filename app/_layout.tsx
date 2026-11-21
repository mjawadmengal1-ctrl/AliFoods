import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { AlertProvider } from '@/template';
import { RestaurantProvider } from '@/contexts/RestaurantContext';
import { useRestaurant } from '@/hooks/useRestaurant';
import { colors } from '@/constants/theme';
function AppNavigator() {
  const { ready } = useRestaurant();
  if (!ready) return <View style={styles.loading}><Text style={styles.brand}>Ali Foods.</Text><ActivityIndicator size="large" color={colors.primary} /></View>;
  return <><StatusBar style="dark" /><Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background }, headerStyle: { backgroundColor: colors.background }, headerTintColor: colors.ink, headerShadowVisible: false, headerTitleStyle: { fontWeight: '700' } }}><Stack.Screen name="(tabs)" /><Stack.Screen name="product/[id]" options={{ headerShown: true, title: 'Your favourite, your way' }} /><Stack.Screen name="cart" options={{ headerShown: true, title: 'Your cart' }} /><Stack.Screen name="checkout" options={{ headerShown: true, title: 'Checkout' }} /><Stack.Screen name="order/[id]" options={{ headerShown: true, title: 'Order details' }} /><Stack.Screen name="admin" options={{ headerShown: true, title: 'Ali Foods · Local admin' }} /></Stack></>;
}
export default function RootLayout() { return <AlertProvider><SafeAreaProvider><RestaurantProvider><AppNavigator /></RestaurantProvider></SafeAreaProvider></AlertProvider>; }
const styles = StyleSheet.create({ loading: { flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', gap: 24 }, brand: { color: colors.primary, fontSize: 42, fontWeight: '900', fontStyle: 'italic' } });
