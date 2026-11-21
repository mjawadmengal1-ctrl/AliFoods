import { Linking } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
export async function openContact(url: string): Promise<void> { await Linking.openURL(url); }
export function whatsappUrl(phone: string, message: string): string { return `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`; }
export function mapsUrl(address: string): string { return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`; }
export async function pickLocalImage(): Promise<string | null> {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) throw new Error('Photo access is required to select an image.');
  const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, quality: 0.5, base64: true });
  if (result.canceled || !result.assets[0]) return null;
  const asset = result.assets[0];
  return asset.base64 ? `data:${asset.mimeType || 'image/jpeg'};base64,${asset.base64}` : asset.uri;
}
