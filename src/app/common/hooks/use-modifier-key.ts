import { useCallback, useEffect, useState } from 'react';

export function buildEnterKeyEvent(onClick: () => void) {
  return (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && onClick) {
      onClick();
    }
  };
}

let timer = 0;

export function useModifierKey(key: 'alt' | 'control', delay = 0) {
  const [isPressed, setIsPressed] = useState(false);

  const keydownFn = useCallback(
    (event: KeyboardEvent) => {
      if (key === 'alt' && event.altKey) {
        timer = window.setTimeout(() => setIsPressed(true), delay);
      }
      if (key === 'control' && event.ctrlKey) {
        timer = window.setTimeout(() => setIsPressed(true), delay);
      }
    },
    [delay, key]
  );

  const keyupFn = useCallback(
    (event: KeyboardEvent) => {
      if (key === 'alt' && !event.altKey) {
        clearTimeout(timer);
        setIsPressed(false);
      }
      if (key === 'control' && !event.ctrlKey) {
        clearTimeout(timer);
        setIsPressed(false);
      }
    },
    [key]
  );

  useEffect(() => {
    document.addEventListener('keydown', keydownFn);
    document.addEventListener('keyup', keyupFn);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('keydown', keydownFn);
      document.removeEventListener('keyup', keyupFn);
    };
  }, [keydownFn, keyupFn]);

  return { isPressed };
}
