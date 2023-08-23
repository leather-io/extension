import { createContext, useContext } from 'react';

import { SwapAsset, SwapFormValues } from './hooks/use-swap';

export interface SwapSubmissionData {
  swapAmountFrom: string;
  swapAmountTo: string;
  swapAssetFrom: SwapAsset;
  swapAssetTo: SwapAsset;
  liquidityFee: number;
  router: SwapAsset[];
  slippage: number;
}

export interface SwapContext {
  swapSubmissionData?: SwapSubmissionData;
  fetchToAmount(from: SwapAsset, to: SwapAsset, fromAmount: string): Promise<string>;
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
