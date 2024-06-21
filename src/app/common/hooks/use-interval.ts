import { useEffect, useRef } from 'react';

import { noop } from '@leather.io/utils';

export function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(noop);

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
