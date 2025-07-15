import { useState } from 'react';
import { useNavigate } from 'react-router';

import type { MarketData, Money } from '@leather.io/models';

import { RouteUrls } from '@shared/route-urls';

import type { HasChildren } from '@app/common/has-children';

import {
  type Fee,
  feeEditorContext as FeeEditorContext,
  type FeeType,
  type Fees,
} from './fee-editor.context';

interface FeeEditorProviderProps extends HasChildren {
  availableBalance: Money;
  fees: Fees;
  feeType: FeeType;
  getCustomFee(rate: number): Fee;
  isLoadingFees: boolean;
  isSponsored: boolean;
  marketData: MarketData;
  onGoBack(): void;
}
export function FeeEditorProvider({
  availableBalance,
  children,
  fees,
  feeType,
  getCustomFee,
  isLoadingFees,
  isSponsored,
  marketData,
  onGoBack,
}: FeeEditorProviderProps) {
  const defaultFee = fees.standard;
  const defaultCustomFee = fees.custom.feeRate?.toString() || fees.custom.feeValue?.toString();

  const [loadedFee, setLoadedFee] = useState<Fee>(defaultFee);
  const [selectedFee, setSelectedFee] = useState<Fee>(defaultFee);
  const [customFee, setCustomFee] = useState<string>(defaultCustomFee ?? '');
  const navigate = useNavigate();

  return (
    <FeeEditorContext.Provider
      value={{
        isLoadingFees,
        isSponsored,
        availableBalance,
        marketData,
        fees,
        feeType,
        loadedFee,
        customFee,
        selectedFee,
        getCustomFee,
        onGoBack,
        onSetLoadedFee: (value: Fee) => setLoadedFee(value),
        onSetCustomFee: (value: string) => setCustomFee(value),
        onSetSelectedFee: (value: Fee) => setSelectedFee(value),
        onUserActivatesFeeEditor: () => navigate(RouteUrls.FeeEditor),
      }}
    >
      {children}
    </FeeEditorContext.Provider>
  );
}
