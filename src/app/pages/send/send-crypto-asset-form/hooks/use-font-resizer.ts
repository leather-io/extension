import { useCallback, useState } from 'react';

import { useOnMount } from '@app/common/hooks/use-on-mount';
import { createDelay } from '@app/common/utils';

const maxFontSize = 48;
const minFontSize = 14;

export const amountInputId = 'amount-input';
export const assetSymbolId = 'asset-symbol';
export const maxInputContainerWidth = 344;

const waitForSymbolToLoad = createDelay(500);

export function useFontResizer() {
  const [inputFontSize, setInputFontSize] = useState(maxFontSize + 'px');
  const [symbolTextWidth, setSymbolTextWidth] = useState(100);

  const onChange = useCallback(
    event => {
      const el = event.target;
      const symbol = document.getElementById(assetSymbolId);
      if (!symbol) return;

      let fontSize = maxFontSize;
      el.style.fontSize = fontSize + 'px';
      setInputFontSize(fontSize + 'px');

      while (fontSize > minFontSize && el.scrollWidth > symbolTextWidth) {
        fontSize--;
        el.style.fontSize = fontSize + 'px';
        setInputFontSize(fontSize + 'px');
      }
    },
    [symbolTextWidth]
  );

  useOnMount(() => {
    const input = document.getElementById(amountInputId);
    const symbol = document.getElementById(assetSymbolId);
    if (!input || !symbol) return;

    input.addEventListener('input', onChange);

    const getSymbolTextWidth = async () => {
      await waitForSymbolToLoad();
      setSymbolTextWidth(symbol.offsetWidth + 4);
    };
    void getSymbolTextWidth();
    return () => {
      input.removeEventListener('input', onChange);
    };
  });

  return { inputFontSize, symbolTextWidth };
}
