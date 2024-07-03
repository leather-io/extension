import { useState } from 'react';

import type { BtcFeeType, Money } from '@leather.io/models';
import { formatMoney } from '@leather.io/utils';
import { Box, FlexProps, Stack, styled } from 'leather-styles/jsx';

import type { TransferRecipient } from '@shared/models/form.model';

import { BitcoinCustomFee } from '@app/components/bitcoin-custom-fee/bitcoin-custom-fee';
import { MAX_FEE_RATE_MULTIPLIER } from '@app/components/bitcoin-custom-fee/hooks/use-bitcoin-custom-fee';
import { OnChooseFeeArgs } from '@app/components/bitcoin-fees-list/bitcoin-fees-list';
import { AvailableBalance } from '@app/features/container/containers/footers/available-balance';
import { useCurrentBtcCryptoAssetBalanceNativeSegwit } from '@app/query/bitcoin/balance/btc-balance-native-segwit.hooks';

import { BitcoinChooseFeeLayout } from './components/bitcoin-choose-fee.layout';
import { ChooseFeeSubtitle } from './components/choose-fee-subtitle';
import { ChooseFeeTabs } from './components/choose-fee-tabs';
import { InsufficientBalanceError } from './components/insufficient-balance-error';

interface BitcoinChooseFeeProps extends FlexProps {
  amount: Money;
  defaultToCustomFee: boolean;
  feesList: React.JSX.Element;
  isLoading: boolean;
  isSendingMax: boolean;
  onChooseFee({ feeRate, feeValue, time }: OnChooseFeeArgs): Promise<void>;
  onSetSelectedFeeType(value: BtcFeeType | null): void;
  onValidateBitcoinSpend(value: number): boolean;
  recipients: TransferRecipient[];
  recommendedFeeRate: string;
  showError: boolean;
  maxRecommendedFeeRate?: number;
}
export function BitcoinChooseFee({
  amount,
  defaultToCustomFee,
  feesList,
  isLoading,
  isSendingMax,
  onChooseFee,
  onSetSelectedFeeType,
  onValidateBitcoinSpend,
  recipients,
  recommendedFeeRate,
  showError,
  maxRecommendedFeeRate = 0,
  ...rest
}: BitcoinChooseFeeProps) {
  const { balance } = useCurrentBtcCryptoAssetBalanceNativeSegwit();
  const hasAmount = amount.amount.isGreaterThan(0);
  const [customFeeInitialValue, setCustomFeeInitialValue] = useState(recommendedFeeRate);

  return (
    <BitcoinChooseFeeLayout isLoading={isLoading} {...rest}>
      <Stack alignItems="center" width="100%">
        {hasAmount && (
          <styled.h3
            textStyle="heading.03"
            color={showError ? 'red.action-primary-default' : 'unset'}
          >
            {formatMoney(amount)}
          </styled.h3>
        )}
        {showError ? (
          <InsufficientBalanceError pb={hasAmount ? '0px' : '16px'} />
        ) : (
          <ChooseFeeSubtitle isSendingMax={isSendingMax} />
        )}
        <ChooseFeeTabs
          defaultToCustomFee={defaultToCustomFee}
          customFee={
            <BitcoinCustomFee
              amount={amount.amount.toNumber()}
              customFeeInitialValue={customFeeInitialValue}
              hasInsufficientBalanceError={showError}
              isSendingMax={isSendingMax}
              onChooseFee={onChooseFee}
              onSetSelectedFeeType={onSetSelectedFeeType}
              onValidateBitcoinSpend={onValidateBitcoinSpend}
              recipients={recipients}
              setCustomFeeInitialValue={setCustomFeeInitialValue}
              maxCustomFeeRate={maxRecommendedFeeRate * MAX_FEE_RATE_MULTIPLIER}
            />
          }
          feesList={feesList}
        />
        <Box mt="space.05" width="100%">
          <AvailableBalance balance={formatMoney(balance.availableBalance)} />
        </Box>
      </Stack>
    </BitcoinChooseFeeLayout>
  );
}
