import { createContext, useContext } from 'react';

import type { MarketData, Money } from '@leather.io/models';

export type FeeType = 'slow' | 'standard' | 'fast' | 'custom';

export interface RawFee {
  type: FeeType;
  baseUnitFeeValue: Money | null;
  feeRate: number | null;
  time: string;
}

export type RawFees = Record<Exclude<FeeType, 'custom'>, RawFee> | undefined;

export interface FeeDisplayInfo {
  feeType: FeeType;
  baseUnitsValue: number;
  feeRate: number;
  titleLeft: string;
  captionLeft: string;
  titleRight?: string;
  captionRight?: string;
}

export interface FeeEditorContext {
  availableBalance: Money;
  customFeeData: RawFee | null;
  customFeeRate: string;
  currentFeeType: FeeType;
  isLoadingFees: boolean;
  marketData: MarketData;
  rawFees: RawFees;
  selectedFeeData: FeeDisplayInfo | null;
  selectedFeeType: FeeType;
  getCustomFeeData(rate: number): RawFee;
  onSetCustomFeeRate(value: string | null): void;
  onSetSelectedFeeType(value: FeeType): void;
  onSetCurrentFeeType(value: FeeType | null): void;
}

const feeEditorContext = createContext<FeeEditorContext | null>(null);

export function useFeeEditorContext() {
  const context = useContext(feeEditorContext);
  if (!context) throw new Error('`useFeeEditorContext` must be used within a `FeeEditorProvider`');
  return context;
}

export const FeeEditorProvider = feeEditorContext.Provider;
