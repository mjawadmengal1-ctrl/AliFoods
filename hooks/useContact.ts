import { useCallback } from 'react';
import { useAlert } from '@/template';
import { openContact } from '@/services/contact';
export function useContact() {
  const { showAlert } = useAlert();
  return useCallback(async (url: string) => { try { await openContact(url); } catch { showAlert('Unable to open link', 'Check that the relevant app is installed, or try again with an internet connection.'); } }, [showAlert]);
}
