import { useEffect, useMemo, useState } from 'react';

import type { MarketData } from '@leather.io/models';

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
  const [selectedFeeType, setSelectedFeeType] = useState<FeeType>(defaultFeeType);
  const [editFeeSelected, setEditFeeSelected] = useState<FeeType>(selectedFeeType);
  const [customFeeRate, setCustomFeeRate] = useState<string>('');

  useEffect(() => {
    if (customFeeRate === '' && selectedFeeType !== 'custom') {
      const data = rawFees[selectedFeeType];
      if (data && data.feeRate) {
        setCustomFeeRate(data.feeRate.toString());
      }
    }
  }, [rawFees, selectedFeeType, customFeeRate]);

  const customFeeData = getCustomFeeData(Number(customFeeRate));

  const selectedFeeData = useMemo(() => {
    if (selectedFeeType === 'custom')
      return formatFeeForDisplay({ rawFee: customFeeData, marketData });
    const rawFee = rawFees[selectedFeeType];
    return formatFeeForDisplay({ rawFee, marketData });
  }, [rawFees, selectedFeeType, customFeeData, marketData, formatFeeForDisplay]);

  return {
    rawFees,
    customFeeData,
    customFeeRate,
    editFeeSelected,
    selectedFeeData,
    selectedFeeType,
    getCustomFeeData,
    onSetCustomFeeRate: (value: string) => setCustomFeeRate(value),
    onSetEditFeeSelected: (value: FeeType) => setEditFeeSelected(value),
    onSetSelectedFeeType: (value: FeeType) => setSelectedFeeType(value),
  };
}
