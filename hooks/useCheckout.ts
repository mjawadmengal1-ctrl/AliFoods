import { useRef, useState } from 'react';
import { useRestaurant } from '@/hooks/useRestaurant';
import { Customer } from '@/services/restaurant';
export function useCheckout() {
  const restaurant = useRestaurant();
  const [customer, setCustomer] = useState<Customer>({ name: '', phone: '', address: '', instructions: '' });
  const [error, setError] = useState(''); const [submitting, setSubmitting] = useState(false); const locked = useRef(false);
  const update = (key: keyof Customer, value: string) => { setCustomer(p => ({ ...p, [key]: value })); setError(''); };
  const submit = (): string | null => {
    if (locked.current) return null;
    if (customer.name.trim().length < 2) { setError('Please enter your full name.'); return null; }
    if (!/^(?:\+92|92|0)3\d{9}$/.test(customer.phone.replace(/[\s-]/g, ''))) { setError('Enter a valid Pakistani mobile number, for example 03XX XXXXXXX.'); return null; }
    if (customer.address.trim().length < 10) { setError('Please enter your complete delivery address in Khuzdar.'); return null; }
    locked.current = true; setSubmitting(true);
    try { return restaurant.placeOrder({ ...customer, name: customer.name.trim(), address: customer.address.trim(), phone: customer.phone.replace(/[\s-]/g, '') }); }
    catch (e) { setError(e instanceof Error ? e.message : 'Your order could not be created.'); locked.current = false; setSubmitting(false); return null; }
  };
  return { ...restaurant, customer, update, error, submitting, submit };
}
