import { createContext, useContext } from 'react';

import type { Blockchain, Money } from '@leather.io/models';
import type { SwapAsset } from '@leather.io/query';

import type { SwapFormValues } from '@shared/models/form.model';

export interface SubmitSwapArgs<T> {
  isSendingMax?: boolean;
  swapData: T;
  values: SwapFormValues;
}

export interface BaseSwapContext<T> {
  chain: Blockchain;
  fee: Money;
  protocol: string;
  swappableAssetsBase: SwapAsset[];
  swappableAssetsQuote: SwapAsset[];
  timestamp: string;
  fetchQuoteAmount(from: SwapAsset, to: SwapAsset, fromAmount: string): Promise<string | undefined>;
  onSubmitSwapForReview({
    values,
    swapData,
    isSendingMax,
  }: SubmitSwapArgs<T>): Promise<Partial<T> | void>;
  onSubmitSwap({ values, swapData }: SubmitSwapArgs<T>): Promise<Partial<T> | void>;
}

interface SwapContext<T> {
  isCrossChainSwap: boolean;
  isFetchingExchangeRate: boolean;
  isPreparingSwapReview: boolean;
  isSendingMax: boolean;
  swapData: T;
  onSetIsCrossChainSwap(value: boolean): void;
  onSetIsFetchingExchangeRate(value: boolean): void;
  onSetIsPreparingSwapReview(value: boolean): void;
  onSetIsSendingMax(value: boolean): void;
  onSetSwapData(data: Partial<T>): void;
}

export const swapContext = createContext<SwapContext<any> | null>(null);

export function useSwapContext<T>() {
  const context = useContext(swapContext) as SwapContext<T>;
  if (!context) throw new Error('`useSwapContext` must be used within a `SwapProvider`');
  return context;
}
