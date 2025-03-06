import { createContext, useContext } from 'react';

import type { MarketData, Money } from '@leather.io/models';

export type FeePriority = 'slow' | 'standard' | 'fast' | 'custom';

export interface Fee {
  type: FeePriority;
  feeRate: number | null;
  feeValue: Money | null;
  time: string;
}

export type Fees = Record<FeePriority, Fee>;

interface FeeEditorContext {
  availableBalance: Money;
  customFeeRate: string;
  loadedFee: Fee;
  isLoadingFees: boolean;
  marketData: MarketData;
  fees: Fees;
  selectedFee: Fee;
  getCustomFee(rate: number): Fee;
  onGoBack(): void;
  onSetCustomFeeRate(value: string | null): void;
  onSetLoadedFee(value: Fee): void;
  onSetSelectedFee(value: Fee): void;
}

export const feeEditorContext = createContext<FeeEditorContext | null>(null);

export function useFeeEditorContext() {
  const context = useContext(feeEditorContext);
  if (!context) throw new Error('`useFeeEditorContext` must be used within a `FeeEditorProvider`');
  return context;
}
