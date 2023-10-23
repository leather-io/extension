import { createContext, useContext } from 'react';

import { SwapAsset, SwapFormValues } from './hooks/use-swap-form';

export interface SwapSubmissionData extends SwapFormValues {
  liquidityFee: number;
  protocol: string;
  router: SwapAsset[];
  slippage: number;
  sponsored: boolean;
  timestamp: string;
}

export interface SwapContext {
  fetchToAmount(from: SwapAsset, to: SwapAsset, fromAmount: string): Promise<string | undefined>;
  isFetchingExchangeRate: boolean;
  isSendingMax: boolean;
  onSetIsFetchingExchangeRate(value: boolean): void;
  onSetIsSendingMax(value: boolean): void;
  onSubmitSwapForReview(values: SwapFormValues): Promise<void> | void;
  onSubmitSwap(): Promise<void> | void;
  swappableAssetsFrom: SwapAsset[];
  swappableAssetsTo: SwapAsset[];
  swapSubmissionData?: SwapSubmissionData;
}

const swapContext = createContext<SwapContext | null>(null);

export function useSwapContext() {
  const context = useContext(swapContext);
  if (!context) throw new Error('No SwapContext found');
  return context;
}

export const SwapProvider = swapContext.Provider;
