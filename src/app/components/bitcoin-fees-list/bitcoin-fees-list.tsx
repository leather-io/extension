import { useCallback } from 'react';

import { Stack } from 'leather-styles/jsx';

import type { BtcFeeType } from '@leather.io/models';

import { LoadingSpinner } from '../loading-spinner';
import { FeesListError } from './components/fees-list-error';
import { FeesListItem } from './components/fees-list-item';

export interface FeesListItem {
  label: BtcFeeType;
  value: number;
  btcValue: string;
  time: string;
  fiatValue: string;
  feeRate: number;
}

export interface OnChooseFeeArgs {
  feeRate: number;
  feeValue: number;
  time: string;
  isCustomFee?: boolean;
}

interface BitcoinFeesListProps {
  feesList: FeesListItem[];
  isLoading: boolean;
  onChooseFee({ feeRate, feeValue, time }: OnChooseFeeArgs): Promise<void>;
  onSetSelectedFeeType(value: BtcFeeType): void;
  onValidateBitcoinSpend(value: number): boolean;
  selectedFeeType: BtcFeeType | null;
}
export function BitcoinFeesList({
  feesList,
  isLoading,
  onChooseFee,
  onSetSelectedFeeType,
  onValidateBitcoinSpend,
  selectedFeeType,
}: BitcoinFeesListProps) {
  const onSelectBtcFeeType = useCallback(
    async ({ feeRate, feeValue, time }: OnChooseFeeArgs, label: BtcFeeType) => {
      onSetSelectedFeeType(label);
      const isValid = onValidateBitcoinSpend(feeValue);
      if (!isValid) return;
      await onChooseFee({ feeRate, feeValue, time });
    },
    [onChooseFee, onSetSelectedFeeType, onValidateBitcoinSpend]
  );

  if (isLoading) return <LoadingSpinner />;
  if (!feesList.length) return <FeesListError />;

  return (
    <Stack gap="space.04" mt="space.02" width="100%">
      {feesList.map(({ label, value, btcValue, fiatValue, time, feeRate }) => (
        <FeesListItem
          arrivesIn={time}
          feeAmount={btcValue}
          feeFiatValue={fiatValue}
          feeRate={feeRate}
          feeType={label}
          key={label}
          isSelected={label === selectedFeeType}
          onClick={() => onSelectBtcFeeType({ feeRate, feeValue: value, time }, label)}
        />
      ))}
    </Stack>
  );
}
