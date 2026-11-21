import { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';
export function useResponsive() {
  const [width, setWidth] = useState(375);
  useEffect(() => { const update = () => setWidth(Math.max(320, Dimensions.get('window').width || 375)); update(); const listener = Dimensions.addEventListener('change', update); return () => listener.remove(); }, []);
  return { width, wide: width >= 600, columns: width >= 600 ? 3 : 2 };
}
