import { useCallback, useState } from 'react';

import { Box, Stack, Text, color } from '@stacks/ui';

import { BtcFeeType } from '@shared/models/fees/bitcoin-fees.model';
import { Money, createMoney } from '@shared/models/money.model';

import { sumMoney } from '@app/common/money/calculate-money';
import { formatMoney } from '@app/common/money/format-money';
import { useCurrentNativeSegwitAddressBalance } from '@app/query/bitcoin/balance/bitcoin-balances.query';

import { LoadingSpinner } from '../loading-spinner';
import { FeesCard } from './components/fees-card';

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
}

interface BitcoinFeesListProps {
  amount: Money;
  feesList: FeesListItem[];
  isLoading: boolean;
  onChooseFee({ feeRate, feeValue, time }: OnChooseFeeArgs): Promise<void>;
  onSetSelectedFeeType(value: BtcFeeType): void;
  selectedFeeType: BtcFeeType;
}
export function BitcoinFeesList({
  amount,
  feesList,
  isLoading,
  onChooseFee,
  onSetSelectedFeeType,
  selectedFeeType,
}: BitcoinFeesListProps) {
  const [showInsufficientBalanceError, setShowInsufficientBalanceError] = useState(false);
  const balance = useCurrentNativeSegwitAddressBalance();

  const onSelectBtcFeeType = useCallback(
    async ({ feeRate, feeValue, time }: OnChooseFeeArgs, label: BtcFeeType) => {
      onSetSelectedFeeType(label);
      const feeAsMoney = createMoney(feeValue, 'BTC');

      if (amount.symbol !== 'BTC') {
        if (feeAsMoney.amount.isGreaterThan(balance.amount)) {
          setShowInsufficientBalanceError(true);
          return;
        }
      }

      // check amount + fee only for BTC
      if (amount.symbol === 'BTC') {
        const totalSpend = sumMoney([amount, feeAsMoney]);

        if (totalSpend.amount.isGreaterThan(balance.amount)) {
          setShowInsufficientBalanceError(true);
          return;
        }
      }

      await onChooseFee({ feeRate, feeValue, time });
    },
    [amount, balance.amount, onChooseFee, onSetSelectedFeeType]
  );

  if (isLoading) return <LoadingSpinner />;

  if (!feesList.length) {
    return (
      <Text color={color('text-caption')} fontSize={1} lineHeight="20px" textAlign="center">
        Unable to calculate fees.
        <br />
        Check balance and try again.
      </Text>
    );
  }

  return (
    <Stack alignItems="center" spacing="base" width="100%">
      {amount.amount.isGreaterThan(0) ? (
        <Text
          color={showInsufficientBalanceError ? color('feedback-error') : 'unset'}
          fontSize={6}
          fontWeight={500}
        >
          {formatMoney(amount)}
        </Text>
      ) : null}
      {showInsufficientBalanceError ? (
        <Box display="flex" alignItems="center" minHeight="40px">
          <Text color={color('feedback-error')} fontSize={1} textAlign="center">
            Fee is too expensive for available balance
          </Text>
        </Box>
      ) : (
        <Text color={color('text-caption')} fontSize={1} lineHeight="20px" textAlign="center">
          Fees are deducted from your balance,
          <br /> it won't affect your sending amount.
        </Text>
      )}
      <Stack mt="tight" spacing="base" width="100%">
        {feesList.map(({ label, value, btcValue, fiatValue, time, feeRate }) => (
          <FeesCard
            arrivesIn={time}
            feeAmount={btcValue}
            feeFiatValue={fiatValue}
            feeType={label}
            key={label}
            isSelected={label === selectedFeeType}
            onClick={() => onSelectBtcFeeType({ feeRate, feeValue: value, time }, label)}
          />
        ))}
      </Stack>
    </Stack>
  );
}
