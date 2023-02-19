import { useMemo } from 'react';

import { StacksTransaction, TokenTransferPayload, addressToString } from '@stacks/transactions';
import { truncateMiddle } from '@stacks/ui-utils';

import { useConvertCryptoCurrencyToFiatAmount } from '@app/common/hooks/use-convert-to-fiat-amount';
import { formatMoney } from '@app/common/money/format-money';

import { ConfirmationDetail } from '../../components/confirmation/components/confirmation-detail';
import { ConfirmationDetailsLayout } from '../../components/confirmation/components/confirmation-details.layout';
import { convertToMoneyTypeWithDefaultOfZero } from '../../components/confirmation/send-form-confirmation.utils';
import { TransactionFee } from '../../components/transaction-fee';

function removeTrailingNullCharacters(s: string) {
  return s.replace(/\0*$/g, '');
}

interface StxSendFormConfirmationDetailsProps {
  unsignedTx: StacksTransaction;
}
export function StxSendFormConfirmationDetails(props: StxSendFormConfirmationDetailsProps) {
  const { unsignedTx } = props;

  const convertFeeToUsd = useConvertCryptoCurrencyToFiatAmount('STX');
  const payload = unsignedTx.payload as TokenTransferPayload;
  const memoContent = payload?.memo?.content ?? ''; // Due to typecast above, using conditional chaining to be on safe
  const memoDisplayText = removeTrailingNullCharacters(memoContent) || 'No memo';

  const amount = convertToMoneyTypeWithDefaultOfZero('STX', Number(payload.amount));
  const fee = convertToMoneyTypeWithDefaultOfZero(
    'STX',
    Number(unsignedTx.auth.spendingCondition.fee)
  );
  const recipient = truncateMiddle(addressToString(payload.recipient.address), 4);

  const feeInUsd = useMemo(() => convertFeeToUsd(fee), [convertFeeToUsd, fee]);

  return (
    <ConfirmationDetailsLayout amount={amount}>
      <ConfirmationDetail detail="Token" value="Stacks" />
      <ConfirmationDetail detail="To" value={recipient} />
      <ConfirmationDetail detail="Memo" value={memoDisplayText} />
      <ConfirmationDetail
        detail="Fee"
        value={<TransactionFee fee={formatMoney(fee)} usdAmount={feeInUsd} />}
      />
      <ConfirmationDetail detail="Nonce" value={String(unsignedTx.auth.spendingCondition.nonce)} />
    </ConfirmationDetailsLayout>
  );
}
