import { useState } from 'react';

import { Box, Stack, Text, color } from '@stacks/ui';

import { Money } from '@shared/models/money.model';

import { formatMoney } from '@app/common/money/format-money';
import { AvailableBalance } from '@app/components/available-balance';
import { OnChooseFeeArgs } from '@app/components/bitcoin-fees-list/bitcoin-fees-list';
import { BitcoinCustomFee } from '@app/features/bitcoin-choose-fee/bitcoin-custom-fee/bitcoin-custom-fee';
import { useNativeSegwitBalance } from '@app/query/bitcoin/balance/bitcoin-balances.query';
import { useCurrentAccountNativeSegwitAddressIndexZero } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';

import { BitcoinChooseFeeLayout } from './components/bitcoin-choose-fee.layout';
import { ChooseFeeSubtitle } from './components/choose-fee-subtitle';
import { ChooseFeeTabs } from './components/choose-fee-tabs';
import { InsufficientBalanceError } from './components/insufficient-balance-error';

interface BitcoinChooseFeeProps {
  amount: Money;
  feesList: React.JSX.Element;
  isSendingMax: boolean;
  showError: boolean;
  onChooseFee({ feeRate, feeValue, time }: OnChooseFeeArgs): Promise<void>;
  onValidateBitcoinSpend(value: number): boolean;
  recipient: string;
  recommendedFeeRate: string;
  isLoading: boolean;
}
export function BitcoinChooseFee({
  amount,
  feesList,
  isSendingMax,
  showError,
  onChooseFee,
  recipient,
  onValidateBitcoinSpend,
  isLoading,
  recommendedFeeRate,
}: BitcoinChooseFeeProps) {
  const currentAccountBtcAddress = useCurrentAccountNativeSegwitAddressIndexZero();
  const btcBalance = useNativeSegwitBalance(currentAccountBtcAddress);
  const hasAmount = amount.amount.isGreaterThan(0);
  const [customFeeInitialValue, setCustomFeeInitialValue] = useState(recommendedFeeRate);

  return (
    <BitcoinChooseFeeLayout isLoading={isLoading}>
      <Stack alignItems="center" spacing="base" width="100%">
        {hasAmount ? (
          <Text color={showError ? color('feedback-error') : 'unset'} fontSize={6} fontWeight={500}>
            {formatMoney(amount)}
          </Text>
        ) : null}
        {showError ? (
          <InsufficientBalanceError pb={hasAmount ? '0px' : '16px'} />
        ) : (
          <ChooseFeeSubtitle isSendingMax={isSendingMax} />
        )}
        <ChooseFeeTabs
          customFee={
            <BitcoinCustomFee
              customFeeInitialValue={customFeeInitialValue}
              setCustomFeeInitialValue={setCustomFeeInitialValue}
              onChooseFee={onChooseFee}
              amount={amount.amount.toNumber()}
              recipient={recipient}
              onValidateBitcoinSpend={onValidateBitcoinSpend}
              hasInsufficientBalanceError={showError}
            />
          }
          feesList={feesList}
        />
        <Box mt="loose" width="100%">
          <AvailableBalance balance={btcBalance.balance} />
        </Box>
      </Stack>
    </BitcoinChooseFeeLayout>
  );
}
