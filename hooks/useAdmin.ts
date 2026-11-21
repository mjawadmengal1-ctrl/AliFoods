import { useState } from 'react';
import { useAlert } from '@/template';
import { useRestaurant } from '@/hooks/useRestaurant';
import { Category, Extra, Product, Settings, foodImages } from '@/services/restaurant';
import { pickLocalImage } from '@/services/contact';
export type AdminTab = 'Menu' | 'Orders' | 'Categories' | 'Settings';
export function useAdmin() {
  const restaurant = useRestaurant(); const { showAlert } = useAlert();
  const [tab, setTab] = useState<AdminTab>('Menu'); const [search, setSearch] = useState(''); const [editing, setEditing] = useState<Product | null>(null); const [category, setCategory] = useState<Category | null>(null); const [error, setError] = useState('');
  const [settings, setSettings] = useState<Settings>(restaurant.data.settings); const [delivery, setDelivery] = useState(restaurant.data.settings.delivery === null ? '' : String(restaurant.data.settings.delivery)); const [saved, setSaved] = useState(false);
  const startProduct = (product?: Product) => { setError(''); setEditing(product ? { ...product, prices: { ...product.prices } } : { id: `dish-${Date.now()}`, name: '', categoryId: restaurant.data.categories[0]?.id || 'pizza', description: '', image: foodImages.pizza, prices: { Regular: null }, available: true, popular: false }); };
  const updateProduct = (patch: Partial<Product>) => setEditing(p => p ? { ...p, ...patch } : p);
  const commitProduct = () => {
    if (!editing) return;
    if (!editing.name.trim() || !editing.description.trim()) { setError('Enter a product name and description.'); return; }
    if (!restaurant.data.categories.some(c => c.id === editing.categoryId)) { setError('Choose an existing category.'); return; }
    if (!editing.image.trim()) { setError('Select a product image or enter an image URL.'); return; }
    if (Object.values(editing.prices).some(p => p !== null && (!Number.isFinite(p) || p < 0))) { setError('Prices must be valid non-negative numbers.'); return; }
    restaurant.saveProduct({ ...editing, name: editing.name.trim(), needsVerification: Object.values(editing.prices).some(p => p === null) }); setEditing(null); setError('');
  };
  const removeProduct = (product: Product) => showAlert('Delete this dish?', `${product.name} will be removed from this device's menu.`, [{ text: 'Cancel', style: 'cancel' }, { text: 'Delete', style: 'destructive', onPress: () => restaurant.deleteProduct(product.id) }]);
  const pickImage = async (target: 'product' | 'category' | 'logo' | 'banner') => { try { const image = await pickLocalImage(); if (!image) return; if (target === 'product') updateProduct({ image }); else if (target === 'category') setCategory(p => p ? { ...p, image } : p); else setSettings(p => ({ ...p, [target]: image })); setSaved(false); } catch (e) { showAlert('Image not selected', e instanceof Error ? e.message : 'Try again.'); } };
  const startCategory = (value?: Category) => { setError(''); setCategory(value ? { ...value } : { id: `category-${Date.now()}`, name: '', image: foodImages.pizza, icon: 'restaurant-outline' }); };
  const commitCategory = () => { if (!category?.name.trim()) { setError('Enter a category name.'); return; } restaurant.saveCategory({ ...category, name: category.name.trim() }); setCategory(null); setError(''); };
  const removeCategory = (value: Category) => { if (restaurant.data.products.some(p => p.categoryId === value.id)) { showAlert('Category still has products', 'Move or delete its products before removing this category.'); return; } showAlert('Delete category?', value.name, [{ text: 'Cancel', style: 'cancel' }, { text: 'Delete', style: 'destructive', onPress: () => restaurant.deleteCategory(value.id) }]); };
  const commitSettings = () => { const fee = delivery.trim() === '' ? null : Number(delivery); if (fee !== null && (!Number.isFinite(fee) || fee < 0)) { setError('Delivery charge must be a non-negative number.'); return; } if (!settings.address.trim()) { setError('Restaurant address is required.'); return; } if (settings.phone && !/^\+?\d{10,13}$/.test(settings.phone)) { setError('Enter a valid restaurant phone number without spaces.'); return; } if (settings.whatsapp && !/^\d{10,15}$/.test(settings.whatsapp)) { setError('WhatsApp must use digits and include the country code.'); return; } restaurant.updateSettings({ ...settings, delivery: fee }); setError(''); setSaved(true); };
  const updateSettingsDraft = (patch: Partial<Settings>) => { setSettings(p => ({ ...p, ...patch })); setSaved(false); };
  const saveExtra = (extra: Extra, value: string) => { const price = value.trim() === '' ? null : Number(value); if (price !== null && (!Number.isFinite(price) || price < 0)) return; restaurant.updateExtra({ ...extra, price }); };
  return { ...restaurant, tab, setTab, search, setSearch, editing, setEditing, category, setCategory, error, startProduct, updateProduct, commitProduct, removeProduct, pickImage, startCategory, commitCategory, removeCategory, settings, delivery, setDelivery, saved, commitSettings, updateSettingsDraft, saveExtra };
}
