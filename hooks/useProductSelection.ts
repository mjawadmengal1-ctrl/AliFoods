import { useEffect, useMemo, useState } from 'react';
import { useRestaurant } from '@/hooks/useRestaurant';
export function useProductSelection(id: string) {
  const { data, addToCart } = useRestaurant();
  const product = data.products.find(p => p.id === id);
  const [size, setSize] = useState(''); const [quantity, setQuantity] = useState(1); const [extraIds, setExtraIds] = useState<string[]>([]); const [instructions, setInstructions] = useState('');
  useEffect(() => { if (product) setSize(Object.keys(product.prices).find(key => product.prices[key] !== null) || Object.keys(product.prices)[0] || 'Regular'); }, [product?.id]);
  const extras = useMemo(() => data.extras.filter(e => extraIds.includes(e.id)), [data.extras, extraIds]);
  const base = product?.prices[size]; const total = base == null ? null : (base + extras.reduce((sum, e) => sum + (e.price || 0), 0)) * quantity;
  const toggleExtra = (id: string) => setExtraIds(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const add = () => { if (product && base != null && product.available) addToCart(product, size, quantity, extras, instructions); };
  return { product, size, setSize, quantity, setQuantity, extraIds, toggleExtra, instructions, setInstructions, total, add, extras: data.extras };
}
