import { useEffect, useMemo, useState } from 'react';

import type { FeesRawData, RawFee } from '@app/components/bitcoin-fees-list/use-bitcoin-fees-data';

export type FeeType = 'slow' | 'standard' | 'fast' | 'custom';

export interface FeeDisplayInfo {
  feeType: FeeType;
  baseUnitsValue: number;
  feeRate: number;
  titleLeft: string;
  captionLeft: string;
  titleRight?: string;
  captionRight?: string;
}

interface UseFeesProps {
  defaultFeeType?: FeeType;
  fees: FeesRawData;
  getCustomFeeData(rate: number): RawFee;
  formatFeeForDisplay(rawFee: RawFee): FeeDisplayInfo;
}

export function useFeesHandler({
  defaultFeeType = 'standard',
  fees,
  getCustomFeeData,
  formatFeeForDisplay,
}: UseFeesProps) {
  const [selectedFeeType, setSelectedFeeType] = useState<FeeType>(defaultFeeType);
  const [editFeeSelected, setEditFeeSelected] = useState<FeeType>(selectedFeeType);
  const [customFeeRate, setCustomFeeRate] = useState<string>('');

  const customFeeData = getCustomFeeData(Number(customFeeRate));

  const selectedFeeData = useMemo(() => {
    if (selectedFeeType === 'custom') {
      return formatFeeForDisplay(customFeeData);
    }

    const rawFee = fees[selectedFeeType];

    if (!rawFee) {
      return {};
    }

    return formatFeeForDisplay(rawFee);
  }, [fees, selectedFeeType, customFeeData, formatFeeForDisplay]);

  useEffect(() => {
    if (customFeeRate === '' && selectedFeeType !== 'custom') {
      const data = fees[selectedFeeType];
      if (data && data.feeRate) {
        setCustomFeeRate(data.feeRate.toString());
      }
    }
  }, [fees, selectedFeeType, customFeeRate]);

  return {
    selectedFeeType,
    setSelectedFeeType,
    selectedFeeData,
    editFeeSelected,
    setEditFeeSelected,
    customFeeRate,
    setCustomFeeRate,
    customFeeData,
  };
}
