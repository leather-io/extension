import { useState } from 'react';

import type { MarketData, Money } from '@leather.io/models';

import type { HasChildren } from '@app/common/has-children';

import {
  type EditorFee,
  type EditorFees,
  feeEditorContext as FeeEditorContext,
} from './fee-editor.context';

interface FeeEditorProviderProps extends HasChildren {
  availableBalance: Money;
  editorFees: EditorFees;
  getCustomEditorFee(rate: number): EditorFee;
  isLoadingFees: boolean;
  marketData: MarketData;
}
export function FeeEditorProvider({
  availableBalance,
  children,
  editorFees,
  getCustomEditorFee,
  isLoadingFees,
  marketData,
}: FeeEditorProviderProps) {
  const [currentEditorFee, setCurrentEditorFee] = useState<EditorFee>(editorFees.standard);
  const [selectedEditorFee, setSelectedEditorFee] = useState<EditorFee>(currentEditorFee);
  const [customEditorFeeRate, setCustomEditorFeeRate] = useState<string>('');

  const customEditorFee = getCustomEditorFee(Number(customEditorFeeRate));

  return (
    <FeeEditorContext.Provider
      value={{
        isLoadingFees,
        availableBalance,
        marketData,
        editorFees,
        currentEditorFee,
        customEditorFee,
        customEditorFeeRate,
        selectedEditorFee,
        getCustomEditorFee,
        onSetCurrentEditorFee: (value: EditorFee) => setCurrentEditorFee(value),
        onSetCustomEditorFeeRate: (value: string) => setCustomEditorFeeRate(value),
        onSetSelectedEditorFee: (value: EditorFee) => setSelectedEditorFee(value),
      }}
    >
      {children}
    </FeeEditorContext.Provider>
  );
}
