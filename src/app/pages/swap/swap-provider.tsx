import { useState } from 'react';

import type { HasChildren } from '@app/common/has-children';

import { type BaseSwapContext, swapContext as SwapContext } from './swap.context';

interface SwapProviderProps<T> extends HasChildren {
  initialData: T;
}
export function SwapProvider<T extends BaseSwapContext<T>>({
  children,
  initialData,
}: SwapProviderProps<T>) {
  const [isCrossChainSwap, setIsCrossChainSwap] = useState(false);
  const [isFetchingExchangeRate, setIsFetchingExchangeRate] = useState(false);
  const [isPreparingSwapReview, setIsPreparingSwapReview] = useState(false);
  const [isSendingMax, setIsSendingMax] = useState(false);
  const [swapData, setSwapData] = useState<T>(initialData);

  function onSetSwapData(data: Partial<T>) {
    setSwapData(prev => ({ ...prev, ...data }));
  }

  return (
    <SwapContext.Provider
      value={{
        isCrossChainSwap,
        isFetchingExchangeRate,
        isPreparingSwapReview,
        isSendingMax,
        swapData,
        onSetSwapData,
        onSetIsCrossChainSwap: (value: boolean) => setIsCrossChainSwap(value),
        onSetIsFetchingExchangeRate: (value: boolean) => setIsFetchingExchangeRate(value),
        onSetIsPreparingSwapReview: (value: boolean) => setIsPreparingSwapReview(value),
        onSetIsSendingMax: (value: boolean) => setIsSendingMax(value),
      }}
    >
      {children}
    </SwapContext.Provider>
  );
}
