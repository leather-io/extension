import { useState } from 'react';

import type { MarketData, Money } from '@leather.io/models';

import type { HasChildren } from '@app/common/has-children';

import { type Fee, feeEditorContext as FeeEditorContext, type Fees } from './fee-editor.context';

interface FeeEditorProviderProps extends HasChildren {
  availableBalance: Money;
  fees: Fees;
  getCustomFee(rate: number): Fee;
  isLoadingFees: boolean;
  marketData: MarketData;
  onGoBack(): void;
}
export function FeeEditorProvider({
  availableBalance,
  children,
  fees,
  getCustomFee,
  isLoadingFees,
  marketData,
  onGoBack,
}: FeeEditorProviderProps) {
  const defaultFee = fees.standard;
  const defaultCustomFeeRate = fees.custom.feeRate?.toString() ?? '';

  const [loadedFee, setLoadedFee] = useState<Fee>(defaultFee);
  const [selectedFee, setSelectedFee] = useState<Fee>(defaultFee);
  const [customFeeRate, setCustomFeeRate] = useState<string>(defaultCustomFeeRate);

  return (
    <FeeEditorContext.Provider
      value={{
        isLoadingFees,
        availableBalance,
        marketData,
        fees,
        loadedFee,
        customFeeRate,
        selectedFee,
        getCustomFee,
        onGoBack,
        onSetLoadedFee: (value: Fee) => setLoadedFee(value),
        onSetCustomFeeRate: (value: string) => setCustomFeeRate(value),
        onSetSelectedFee: (value: Fee) => setSelectedFee(value),
      }}
    >
      {children}
    </FeeEditorContext.Provider>
  );
}
