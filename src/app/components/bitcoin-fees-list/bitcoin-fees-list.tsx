import { useCallback, useState } from 'react';

import { Stack, Text, color } from '@stacks/ui';

import { BtcFeeType } from '@shared/models/fees/bitcoin-fees.model';
import { Money, createMoney } from '@shared/models/money.model';

import { sumMoney } from '@app/common/money/calculate-money';
import { formatMoney } from '@app/common/money/format-money';
import { useCurrentNativeSegwitAddressBalance } from '@app/query/bitcoin/balance/bitcoin-balances.query';

import { LoadingSpinner } from '../loading-spinner';
import { FeesListError } from './components/fees-list-error';
import { FeesListItem } from './components/fees-list-item';
import { FeesListSubtitle } from './components/fees-list-subtitle';
import { InsufficientBalanceError } from './components/insufficient-balance-error';

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
  isSendingMax: boolean;
  onChooseFee({ feeRate, feeValue, time }: OnChooseFeeArgs): Promise<void>;
  onSetSelectedFeeType(value: BtcFeeType): void;
  selectedFeeType: BtcFeeType | null;
}
export function BitcoinFeesList({
  amount,
  feesList,
  isLoading,
  isSendingMax,
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

  // TODO: This should be changed when custom fees are implemented. We can simply
  // force custom fee setting when api requests fail and we can't calculate fees.
  if (!feesList.length) return <FeesListError />;

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
        <InsufficientBalanceError />
      ) : (
        <FeesListSubtitle isSendingMax={isSendingMax} />
      )}
      <Stack mt="tight" spacing="base" width="100%">
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
    </Stack>
  );
}
