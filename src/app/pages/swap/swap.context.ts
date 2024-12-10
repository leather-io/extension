import { createContext, useContext } from 'react';

import type { SwapAsset } from '@leather.io/query';

import type { SwapFormValues } from '@shared/models/form.model';

export interface SwapSubmissionData extends SwapFormValues {
  liquidityFee: number;
  protocol: string;
  router: SwapAsset[];
  dexPath?: string[];
  slippage: number;
  sponsored?: boolean;
  timestamp: string;
  txData?: Record<string, any>;
}

export interface SwapContext {
  fetchQuoteAmount(from: SwapAsset, to: SwapAsset, fromAmount: string): Promise<string | undefined>;
  isCrossChainSwap: boolean;
  isFetchingExchangeRate: boolean;
  isSendingMax: boolean;
  isPreparingSwapReview: boolean;
  onSetIsCrossChainSwap(value: boolean): void;
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
