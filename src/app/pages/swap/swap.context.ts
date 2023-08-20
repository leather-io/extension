import { createContext, useContext } from 'react';

import { SwapAsset, SwapFormValues } from './hooks/use-swap';

export interface SwapContext {
  exchangeRate: number;
  isSendingMax: boolean;
  onSetExchangeRate(value: number): void;
  onSetIsSendingMax(value: boolean): void;
  onSubmitSwapForReview(values: SwapFormValues): Promise<void> | void;
  onSubmitSwap(): Promise<void> | void;
  swappableAssets: SwapAsset[];
}

const swapContext = createContext<SwapContext | null>(null);

export function useSwapContext() {
  const context = useContext(swapContext);
  if (!context) throw new Error('No SwapContext found');
  return context;
}

export const SwapProvider = swapContext.Provider;
