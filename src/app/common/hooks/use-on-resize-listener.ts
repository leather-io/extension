import { useEffect } from 'react';

export function useOnResizeListener(callback: () => void) {
  useEffect(() => {
    const onResize = () => callback();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [callback]);
}
