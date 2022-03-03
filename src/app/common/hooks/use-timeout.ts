import { useEffect, useRef } from 'react';

export function useTimeout(callback: () => void, delay: number) {
  const timeoutRef = useRef<null | number | ReturnType<typeof setTimeout>>(null);
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const tick = () => savedCallback.current();
    timeoutRef.current = window.setTimeout(tick, delay);
    return () => window.clearTimeout(timeoutRef.current as any);
  }, [delay]);

  return timeoutRef;
}
