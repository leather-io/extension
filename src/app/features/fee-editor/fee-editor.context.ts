import { createContext, useContext } from 'react';

import type { MarketData, Money } from '@leather.io/models';

export type FeePriority = 'slow' | 'standard' | 'fast' | 'custom';
export const feePriorityTimeMap: Record<FeePriority, string> = {
  slow: '~10 – 20min',
  standard: '~30 min',
  fast: '~1 hour+',
  custom: '',
};

export interface Fee {
  priority: FeePriority;
  feeRate?: number;
  feeValue?: number;
  txFee: Money | null;
  time: string;
}

export type Fees = Record<FeePriority, Fee>;
export type FeeType = 'fee-rate' | 'fee-value';

interface FeeEditorContext {
  availableBalance: Money;
  customFee: string;
  feeType: FeeType;
  loadedFee: Fee;
  isLoadingFees: boolean;
  marketData: MarketData;
  fees: Fees;
  selectedFee: Fee;
  getCustomFee(rate: number): Fee;
  onGoBack(): void;
  onSetCustomFee(value: string | null): void;
  onSetLoadedFee(value: Fee): void;
  onSetSelectedFee(value: Fee): void;
  onUserActivatesFeeEditor(): void;
}

export const feeEditorContext = createContext<FeeEditorContext | null>(null);

export function useFeeEditorContext() {
  const context = useContext(feeEditorContext);
  if (!context) throw new Error('`useFeeEditorContext` must be used within a `FeeEditorProvider`');
  return context;
}
