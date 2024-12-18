import { useEffect, useMemo, useState } from 'react';

import type { MarketData } from '@leather.io/models';

import type { RawFee } from '@app/components/bitcoin-fees-list/bitcoin-fees.utils';

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

export interface FormatFeeForDisplayArgs {
  rawFee: RawFee;
  marketData: MarketData;
}

interface UseFeesProps {
  defaultFeeType?: FeeType;
  fees: FeesRawData;
  getCustomFeeData(rate: number): RawFee;
  marketData: MarketData;
  formatFeeForDisplay({ rawFee, marketData }: FormatFeeForDisplayArgs): FeeDisplayInfo;
}

export type FeesRawData = Record<Exclude<FeeType, 'custom'>, RawFee>;

export function useFeesHandler({
  defaultFeeType = 'standard',
  fees,
  getCustomFeeData,
  marketData,
  formatFeeForDisplay,
}: UseFeesProps) {
  const [selectedFeeType, setSelectedFeeType] = useState<FeeType>(defaultFeeType);
  const [editFeeSelected, setEditFeeSelected] = useState<FeeType>(selectedFeeType);
  const [customFeeRate, setCustomFeeRate] = useState<string>('');

  const customFeeData = getCustomFeeData(Number(customFeeRate));

  const selectedFeeData = useMemo(() => {
    if (selectedFeeType === 'custom') {
      return formatFeeForDisplay({ rawFee: customFeeData, marketData });
    }

    const rawFee = fees[selectedFeeType];

    if (!rawFee) {
      return {};
    }

    return formatFeeForDisplay({ rawFee, marketData });
  }, [fees, selectedFeeType, customFeeData, marketData, formatFeeForDisplay]);

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
