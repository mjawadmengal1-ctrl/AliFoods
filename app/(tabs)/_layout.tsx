import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform } from 'react-native';
import { colors } from '@/constants/theme';
export default function TabLayout() {
  const insets = useSafeAreaInsets();
  return <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: colors.primary, tabBarInactiveTintColor: colors.subtle, tabBarLabelStyle: { fontSize: 10, fontWeight: '600', marginTop: 3 }, tabBarStyle: { height: Platform.select({ ios: insets.bottom + 60, android: insets.bottom + 60, default: 70 }), paddingTop: 8, paddingBottom: Platform.select({ ios: insets.bottom + 8, android: insets.bottom + 8, default: 8 }), paddingHorizontal: 16, backgroundColor: colors.surface, borderTopColor: colors.border, borderTopWidth: 1, elevation: 0 }, tabBarItemStyle: { borderRadius: 12 } }}>
    <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: ({ color, size, focused }) => <Ionicons name={focused ? 'home' : 'home-outline'} color={color} size={size} /> }} />
    <Tabs.Screen name="categories" options={{ title: 'Categories', tabBarIcon: ({ color, size, focused }) => <Ionicons name={focused ? 'grid' : 'grid-outline'} color={color} size={size} /> }} />
    <Tabs.Screen name="deals" options={{ title: 'Deals', tabBarIcon: ({ color, size, focused }) => <Ionicons name={focused ? 'pricetag' : 'pricetag-outline'} color={color} size={size} /> }} />
    <Tabs.Screen name="orders" options={{ title: 'My Orders', tabBarIcon: ({ color, size, focused }) => <Ionicons name={focused ? 'receipt' : 'receipt-outline'} color={color} size={size} /> }} />
    <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: ({ color, size, focused }) => <Ionicons name={focused ? 'person' : 'person-outline'} color={color} size={size} /> }} />
  </Tabs>;
}
