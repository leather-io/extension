import { createContext, useContext } from 'react';

import type { MarketData, Money } from '@leather.io/models';

export type EditorFeeType = 'slow' | 'standard' | 'fast' | 'custom';

export interface EditorFee {
  type: EditorFeeType;
  feeRate: number | null;
  feeValue: Money | null;
  time: string;
}

export type EditorFees = Record<Exclude<EditorFeeType, 'custom'>, EditorFee>;

interface FeeEditorContext {
  availableBalance: Money;
  customEditorFee: EditorFee;
  customEditorFeeRate: string;
  currentEditorFee: EditorFee;
  isLoadingFees: boolean;
  marketData: MarketData;
  editorFees: EditorFees;
  selectedEditorFee: EditorFee;
  getCustomEditorFee(rate: number): EditorFee;
  onSetCustomEditorFeeRate(value: string | null): void;
  onSetCurrentEditorFee(value: EditorFee): void;
  onSetSelectedEditorFee(value: EditorFee): void;
}

export const feeEditorContext = createContext<FeeEditorContext | null>(null);

export function useFeeEditorContext() {
  const context = useContext(feeEditorContext);
  if (!context) throw new Error('`useFeeEditorContext` must be used within a `FeeEditorProvider`');
  return context;
}
