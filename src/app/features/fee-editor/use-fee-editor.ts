import { useEffect, useMemo, useState } from 'react';

import type { MarketData } from '@leather.io/models';
import { isDefined, isUndefined } from '@leather.io/utils';

import type { FeeDisplayInfo, FeeType, RawFee, RawFees } from './fee-editor.context';

export interface FormatFeeForDisplayArgs {
  rawFee: RawFee;
  marketData: MarketData;
}

interface UseFeeEditorArgs {
  defaultFeeType?: FeeType;
  marketData: MarketData;
  rawFees: RawFees;
  formatFeeForDisplay({ rawFee, marketData }: FormatFeeForDisplayArgs): FeeDisplayInfo;
  getCustomFeeData(rate: number): RawFee;
}
export function useFeeEditor({
  defaultFeeType = 'standard',
  marketData,
  rawFees,
  formatFeeForDisplay,
  getCustomFeeData,
}: UseFeeEditorArgs) {
  const [currentFeeType, setCurrentFeeType] = useState<FeeType>(defaultFeeType);
  const [selectedFeeType, setSelectedFeeType] = useState<FeeType>(currentFeeType);
  const [customFeeRate, setCustomFeeRate] = useState<string>('');

  useEffect(() => {
    if (isDefined(rawFees) && customFeeRate === '' && selectedFeeType !== 'custom') {
      const data = rawFees[selectedFeeType];
      if (data && data.feeRate) setCustomFeeRate(data.feeRate.toString());
    }
  }, [rawFees, selectedFeeType, customFeeRate]);

  const customFeeData = getCustomFeeData(Number(customFeeRate));

  const selectedFeeData = useMemo(() => {
    if (isUndefined(rawFees)) return null;
    if (selectedFeeType === 'custom')
      return formatFeeForDisplay({ rawFee: customFeeData, marketData });
    const rawFee = rawFees[selectedFeeType];
    return formatFeeForDisplay({ rawFee, marketData });
  }, [rawFees, selectedFeeType, customFeeData, marketData, formatFeeForDisplay]);

  return {
    rawFees,
    currentFeeType,
    customFeeData,
    customFeeRate,
    selectedFeeData,
    selectedFeeType,
    getCustomFeeData,
    onSetCurrentFeeType: (value: FeeType) => setCurrentFeeType(value),
    onSetCustomFeeRate: (value: string) => setCustomFeeRate(value),
    onSetSelectedFeeType: (value: FeeType) => setSelectedFeeType(value),
  };
}
