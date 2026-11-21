import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Category { id: string; name: string; image: string; icon: string }
export interface Product { id: string; name: string; categoryId: string; description: string; image: string; prices: Record<string, number | null>; available: boolean; popular: boolean; needsVerification?: boolean }
export interface Extra { id: string; name: string; price: number | null }
export interface CartItem { id: string; productId: string; name: string; image: string; size: string; extras: Extra[]; instructions: string; unitPrice: number; quantity: number }
export interface Customer { name: string; phone: string; address: string; instructions: string }
export const orderStatuses = ['Order Received', 'Order Confirmed', 'Preparing Your Food', 'Out for Delivery', 'Delivered'] as const;
export interface Order { id: string; createdAt: string; customer: Customer; items: CartItem[]; subtotal: number; delivery: number; total: number; status: number }
export interface Settings { delivery: number | null; phone: string; whatsapp: string; hours: string; address: string; logo: string; banner: string }
export interface RestaurantData { products: Product[]; categories: Category[]; extras: Extra[]; cart: CartItem[]; orders: Order[]; settings: Settings }
export const menuImage = 'https://cdn-ai.onspace.ai/onspace/files/aeo9wgoDYYcPNDvHcTpVBT/Screenshot_2026-11-20_195642.png';
export const foodImages = {
  pizza: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=900&auto=format&fit=crop&q=85',
  burger: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=700&auto=format&fit=crop&q=85',
  sandwich: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=700&auto=format&fit=crop&q=85',
  roll: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=700&auto=format&fit=crop&q=85',
  fries: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=700&auto=format&fit=crop&q=85',
  wings: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=700&auto=format&fit=crop&q=85',
};
const categories: Category[] = [
  { id: 'pizza', name: 'Pizza', image: foodImages.pizza, icon: 'pizza-outline' },
  { id: 'burger', name: 'Burger', image: foodImages.burger, icon: 'fast-food-outline' },
  { id: 'sandwich', name: 'Sandwich', image: foodImages.sandwich, icon: 'restaurant-outline' },
  { id: 'roll', name: 'Breast & Roll', image: foodImages.roll, icon: 'flame-outline' },
  { id: 'fries', name: 'Fries', image: foodImages.fries, icon: 'nutrition-outline' },
  { id: 'deals', name: 'Special Deals', image: foodImages.wings, icon: 'pricetag-outline' },
];
function product(id: string, name: string, categoryId: string, prices: Record<string, number | null>, popular = false, needsVerification = false): Product {
  return { id, name, categoryId, prices, popular, needsVerification, available: true,
    image: categoryId === 'deals' ? (id === 'deal1' ? foodImages.wings : foodImages.roll) : categories.find(c => c.id === categoryId)?.image || foodImages.pizza,
    description: categoryId === 'deals' ? `${name}. A sharing deal from the original Ali Foods menu.` : `${name}, freshly prepared at Ali Foods. Made to order for a delicious, satisfying bite.` };
}
export function initialData(): RestaurantData {
  const pizza = ['Chicken Tikka Pizza', 'Chicken Fajita Pizza', 'BBQ Spicy Pizza', 'Veggie Lover Pizza', 'Malai Boti Pizza', 'Ali Special Pizza', 'Paneer Veg Pizza', 'Arabian Green Pizza', 'Kabab Chaska'];
  return {
    categories,
    products: [
      ...pizza.map((name, i) => product(`pizza${i}`, name, 'pizza', i === 8 ? { Small: null, Medium: null, Large: null } : { Small: i < 4 ? 350 : 400, Medium: i < 4 ? 600 : 650, Large: i === 4 || i === 5 ? 1100 : 1000 }, i === 0 || i === 5, i === 8)),
      product('burger0', 'Zinger Burger', 'burger', { Regular: 300 }, true),
      product('burger1', 'Zinger Cheese Burger', 'burger', { Regular: 350 }, true),
      product('burger2', 'Zinger Double Decker', 'burger', { Regular: null }, false, true),
      product('burger3', 'Chicken Burger', 'burger', { Regular: 290 }),
      product('burger4', 'Chicken Cheese Burger', 'burger', { Regular: 300 }),
      product('burger5', 'Chicken Double Decker', 'burger', { Regular: 450 }),
      product('sandwich0', 'Club Sandwich', 'sandwich', { Regular: 400 }, true),
      product('sandwich1', 'Chicken Sandwich', 'sandwich', { Regular: 300 }),
      product('sandwich2', 'Malai Sandwich', 'sandwich', { Regular: 450 }),
      ...[['Chicken Quarter Chest', 500], ['Crispy Warp', 250], ['Garo', 250], ['Chicken Roll', 250], ['Mayo Roll', 250], ['Crispy Roll', 250], ['Ali Special Roll', 260]].map(([name, price], i) => product(`roll${i}`, String(name), 'roll', { Regular: Number(price) }, i === 5, i === 2)),
      ...[['Chicken Strip (6 Pieces) With Fries', 400], ['Pizza Fries Chicken', 400], ['Pizza Fries Simple', 350], ['Mayo Fries', 300], ['Masala Fries', 200]].map(([name, price], i) => product(`fries${i}`, String(name), 'fries', { Regular: Number(price) }, i === 1)),
      ...['3 Crispy Wings', '3 Shawarma Rolls', '3 Chicken Rolls', '3 Mayo Rolls'].map((name, i) => product(`deal${i + 1}`, name, 'deals', { Deal: 700 }, false)),
    ],
    extras: [{ id: 'chicken', name: 'Chicken Extra', price: 100 }, { id: 'cheese', name: 'Cheese Extra', price: 100 }, { id: 'slices', name: 'Cheese Slices', price: 50 }, { id: 'mayo', name: 'Mayo Extra Dip', price: 50 }],
    cart: [], orders: [],
    settings: { delivery: null, phone: '03308325793', whatsapp: '923308325793', hours: '10:00 AM – 1:00 AM', address: 'Main RCD Road, Near Dubai Masjid, Khuzdar.', logo: '', banner: foodImages.pizza },
  };
}
const storageKey = 'ali-foods-local-v1';
export async function loadRestaurant(): Promise<RestaurantData> {
  const stored = await AsyncStorage.getItem(storageKey);
  if (!stored) return initialData();
  try { return JSON.parse(stored) as RestaurantData; } catch { return initialData(); }
}
export async function saveRestaurant(data: RestaurantData): Promise<void> { await AsyncStorage.setItem(storageKey, JSON.stringify(data)); }
export function money(value: number): string { return `Rs. ${value.toLocaleString('en-PK')}`; }
export function startingPrice(product: Product): number | null { const values = Object.values(product.prices).filter((p): p is number => p !== null); return values.length ? Math.min(...values) : null; }
export function createOrder(items: CartItem[], customer: Customer, delivery: number): Order {
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  return { id: `AF-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`, createdAt: new Date().toISOString(), customer, items, subtotal, delivery, total: subtotal + delivery, status: 0 };
}
