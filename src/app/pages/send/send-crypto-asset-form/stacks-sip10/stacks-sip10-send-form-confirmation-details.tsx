import { useMemo } from 'react';

import {
  ContractCallPayload,
  StacksTransaction,
  cvToString,
  cvToValue,
} from '@stacks/transactions';
import { truncateMiddle } from '@stacks/ui-utils';

import { useConvertCryptoCurrencyToFiatAmount } from '@app/common/hooks/use-convert-to-fiat-amount';
import { convertAmountToBaseUnit } from '@app/common/money/calculate-money';
import { TransactionFee } from '@app/components/fee-row/components/transaction-fee';
import { Caption } from '@app/components/typography';

import { ConfirmationDetail } from '../_components/confirmation/components/confirmation-detail';
import { ConfirmationDetailsLayout } from '../_components/confirmation/components/confirmation-details.layout';
import { convertToMoneyTypeWithDefaultOfZero } from '../_components/confirmation/send-form-confirmation.utils';

interface StacksSip10SendFormConfirmationDetailsProps {
  decimals: number;
  symbol: string;
  token: string;
  unsignedTx: StacksTransaction;
}
export function StacksSip10SendFormConfirmationDetails(
  props: StacksSip10SendFormConfirmationDetailsProps
) {
  const { decimals, symbol, token, unsignedTx } = props;

  const convertFeeToUsd = useConvertCryptoCurrencyToFiatAmount('STX');
  const payload = unsignedTx.payload as ContractCallPayload;

  const amount = convertToMoneyTypeWithDefaultOfZero(
    symbol.toUpperCase(),
    Number(cvToValue(payload.functionArgs[0])),
    decimals
  );
  const fee = convertToMoneyTypeWithDefaultOfZero(
    'STX',
    Number(unsignedTx.auth.spendingCondition.fee)
  );
  const recipient = truncateMiddle(cvToString(payload.functionArgs[2]), 4);
  const memo = cvToString(payload.functionArgs[3]);

  const feeInUsd = useMemo(() => convertFeeToUsd(fee), [convertFeeToUsd, fee]);

  return (
    <ConfirmationDetailsLayout amount={amount}>
      <ConfirmationDetail detail="Token" value={token} />
      <ConfirmationDetail detail="To" value={recipient} />
      <ConfirmationDetail
        detail="Memo"
        value={memo !== 'none' ? memo : <Caption>No memo</Caption>}
      />
      <ConfirmationDetail
        detail="Fee"
        value={
          <TransactionFee fee={convertAmountToBaseUnit(fee).toString()} usdAmount={feeInUsd} />
        }
      />
      <ConfirmationDetail detail="Nonce" value={String(unsignedTx.auth.spendingCondition.nonce)} />
    </ConfirmationDetailsLayout>
  );
}
