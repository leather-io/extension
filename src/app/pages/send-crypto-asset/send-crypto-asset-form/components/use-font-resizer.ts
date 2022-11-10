import { useCallback, useEffect, useState } from 'react';

import { useOnMount } from '@app/common/hooks/use-on-mount';

const maxFontSize = 48;
const minFontSize = 14;

export const amountInputId = 'crypto-send-form-amount';
export const maxInputContainerWidth = 344;

export function useFontResizer() {
  const [inputFontSize, setInputFontSize] = useState(maxFontSize + 'px');

  useOnMount(() => {
    const input = document.getElementById(amountInputId);
    if (!input) return;

    input.style.fontSize = maxFontSize + 'px';
  });

  const onChange = useCallback(event => {
    const el = event.target;

    let fontSize = maxFontSize;
    el.style.fontSize = fontSize + 'px';
    setInputFontSize(fontSize + 'px');
    while (fontSize > minFontSize && el.scrollWidth > el.clientWidth) {
      fontSize--;
      el.style.fontSize = fontSize + 'px';
      setInputFontSize(fontSize + 'px');
    }
  }, []);

  useEffect(() => {
    document.addEventListener('input', onChange);
    return () => {
      document.removeEventListener('input', onChange);
    };
  }, [onChange]);

  return { inputFontSize };
}
