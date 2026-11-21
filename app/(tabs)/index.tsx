import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Screen } from '@/components/layout/Screen';
import { HomeHeader } from '@/components/feature/HomeHeader';
import { ProductCard } from '@/components/feature/ProductCard';
import { useRestaurant } from '@/hooks/useRestaurant';
import { useResponsive } from '@/hooks/useResponsive';
import { colors, spacing } from '@/constants/theme';
export default function HomePage() {
  const [search, setSearch] = useState(''); const { data } = useRestaurant(); const { columns } = useResponsive();
  const products = useMemo(() => data.products.filter(p => search.trim() ? p.name.toLowerCase().includes(search.trim().toLowerCase()) : p.popular), [data.products, search]);
  return <Screen tabs keyboard><FlatList key={columns} numColumns={columns} data={products} keyExtractor={item => item.id} renderItem={({ item }) => <ProductCard product={item} />} showsVerticalScrollIndicator={false} contentContainerStyle={styles.content} columnWrapperStyle={styles.row} ListHeaderComponent={<HomeHeader search={search} onSearch={setSearch} />} ListEmptyComponent={<Text style={styles.empty}>No dishes found. Try pizza, zinger or fries.</Text>} ListFooterComponent={<View style={styles.footer}><Text style={styles.footerBrand}>Made fresh. Served with care.</Text><Text style={styles.footerText}>ALI FOODS · KHUZDAR</Text><Text style={styles.local}>Local preview · Orders are not sent to the restaurant</Text></View>} /></Screen>;
}
const styles = StyleSheet.create({ content: { padding: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.xl }, row: { marginHorizontal: -4 }, empty: { color: colors.subtle, fontSize: 16, textAlign: 'center', padding: spacing.lg }, footer: { alignItems: 'center', paddingTop: spacing.xl, gap: spacing.sm }, footerBrand: { fontSize: 18, fontWeight: '700', color: colors.ink }, footerText: { fontSize: 10, letterSpacing: 2, color: colors.subtle }, local: { fontSize: 10, color: colors.subtle, marginTop: 8 } });
