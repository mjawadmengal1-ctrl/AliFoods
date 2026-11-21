import { createContext, ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { CartItem, Category, Customer, Extra, Product, RestaurantData, Settings, createOrder, initialData, loadRestaurant, saveRestaurant } from '@/services/restaurant';
interface RestaurantContextValue {
  data: RestaurantData; ready: boolean; storageError: string; cartCount: number; subtotal: number;
  addToCart: (product: Product, size: string, quantity: number, extras: Extra[], instructions: string) => void;
  changeQuantity: (id: string, quantity: number) => void; removeFromCart: (id: string) => void;
  placeOrder: (customer: Customer) => string; saveProduct: (product: Product) => void;
  deleteProduct: (id: string) => void; saveCategory: (category: Category) => void;
  deleteCategory: (id: string) => void; updateSettings: (settings: Settings) => void;
  updateExtra: (extra: Extra) => void; updateStatus: (id: string, status: number) => void;
}
export const RestaurantContext = createContext<RestaurantContextValue | undefined>(undefined);
export function RestaurantProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<RestaurantData>(initialData);
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState('');
  const saveQueue = useRef(Promise.resolve());
  useEffect(() => { let active = true; loadRestaurant().then(value => { if (active) setData(value); }).catch(() => { if (active) setStorageError('Local storage could not be loaded. Changes may not persist.'); }).finally(() => { if (active) setReady(true); }); return () => { active = false; }; }, []);
  useEffect(() => { if (!ready) return; saveQueue.current = saveQueue.current.then(() => saveRestaurant(data)).catch(() => setStorageError('Changes could not be saved on this device.')); }, [data, ready]);
  const addToCart = useCallback((product: Product, size: string, quantity: number, extras: Extra[], instructions: string) => {
    const base = product.prices[size];
    if (base == null || !product.available) return;
    const item: CartItem = { id: `${Date.now()}-${Math.random()}`, productId: product.id, name: product.name, image: product.image, size, quantity, extras, instructions: instructions.trim(), unitPrice: base + extras.reduce((sum, extra) => sum + (extra.price || 0), 0) };
    setData(previous => ({ ...previous, cart: [...previous.cart, item] }));
  }, []);
  const changeQuantity = useCallback((id: string, quantity: number) => setData(p => ({ ...p, cart: quantity < 1 ? p.cart.filter(i => i.id !== id) : p.cart.map(i => i.id === id ? { ...i, quantity } : i) })), []);
  const removeFromCart = useCallback((id: string) => setData(p => ({ ...p, cart: p.cart.filter(i => i.id !== id) })), []);
  const placeOrder = useCallback((customer: Customer) => {
    if (!data.cart.length) throw new Error('Your cart is empty.');
    if (data.settings.delivery === null) throw new Error('Set the fixed delivery charge in the local admin dashboard before testing checkout.');
    for (const item of data.cart) { const product = data.products.find(p => p.id === item.productId); if (!product?.available || product.prices[item.size] == null) throw new Error(`${item.name} is no longer available. Please remove it from your cart.`); const currentPrice = (product.prices[item.size] || 0) + item.extras.reduce((sum, e) => sum + (data.extras.find(x => x.id === e.id)?.price || 0), 0); if (currentPrice !== item.unitPrice) throw new Error(`The price of ${item.name} changed. Please remove it and add it again.`); }
    const order = createOrder(data.cart, customer, data.settings.delivery);
    setData(p => ({ ...p, orders: [order, ...p.orders], cart: [] }));
    return order.id;
  }, [data]);
  const saveProduct = useCallback((product: Product) => setData(p => ({ ...p, products: p.products.some(x => x.id === product.id) ? p.products.map(x => x.id === product.id ? product : x) : [...p.products, product] })), []);
  const deleteProduct = useCallback((id: string) => setData(p => ({ ...p, products: p.products.filter(x => x.id !== id), cart: p.cart.filter(x => x.productId !== id) })), []);
  const saveCategory = useCallback((category: Category) => setData(p => ({ ...p, categories: p.categories.some(x => x.id === category.id) ? p.categories.map(x => x.id === category.id ? category : x) : [...p.categories, category] })), []);
  const deleteCategory = useCallback((id: string) => setData(p => ({ ...p, categories: p.categories.filter(x => x.id !== id) })), []);
  const updateSettings = useCallback((settings: Settings) => setData(p => ({ ...p, settings })), []);
  const updateExtra = useCallback((extra: Extra) => setData(p => ({ ...p, extras: p.extras.map(x => x.id === extra.id ? extra : x) })), []);
  const updateStatus = useCallback((id: string, status: number) => setData(p => ({ ...p, orders: p.orders.map(x => x.id === id ? { ...x, status } : x) })), []);
  return <RestaurantContext.Provider value={{ data, ready, storageError, addToCart, changeQuantity, removeFromCart, placeOrder, saveProduct, deleteProduct, saveCategory, deleteCategory, updateSettings, updateExtra, updateStatus, cartCount: data.cart.reduce((sum, i) => sum + i.quantity, 0), subtotal: data.cart.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0) }}>{children}</RestaurantContext.Provider>;
}
