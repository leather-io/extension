import { createContext, useContext } from 'react';

import type { SwapAsset } from '@leather-wallet/query';

import { SwapFormValues } from './hooks/use-swap-form';

export interface SwapSubmissionData extends SwapFormValues {
  liquidityFee: number;
  protocol: string;
  router: SwapAsset[];
  slippage: number;
  sponsored: boolean;
  timestamp: string;
}

export interface SwapContext {
  fetchQuoteAmount(from: SwapAsset, to: SwapAsset, fromAmount: string): Promise<string | undefined>;
  isFetchingExchangeRate: boolean;
  isSendingMax: boolean;
  onSetIsFetchingExchangeRate(value: boolean): void;
  onSetIsSendingMax(value: boolean): void;
  onSubmitSwapForReview(values: SwapFormValues): Promise<void> | void;
  onSubmitSwap(): Promise<void> | void;
  swappableAssetsBase: SwapAsset[];
  swappableAssetsQuote: SwapAsset[];
  swapSubmissionData?: SwapSubmissionData;
}

const swapContext = createContext<SwapContext | null>(null);

export function useSwapContext() {
  const context = useContext(swapContext);
  if (!context) throw new Error('No SwapContext found');
  return context;
}

export const SwapProvider = swapContext.Provider;
