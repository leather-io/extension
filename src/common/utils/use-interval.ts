import { useEffect, useRef } from 'react';

export function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(() => {});

  // Remember the latest callback.
  useEffect(() => {
    if (savedCallback) {
      savedCallback.current = callback;
    }
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
    return;
  }, [delay]);
}
