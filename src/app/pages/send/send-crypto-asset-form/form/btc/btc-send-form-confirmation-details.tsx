import { useMemo } from 'react';

import { Psbt } from 'bitcoinjs-lib';

import { logger } from '@shared/logger';

import { useConvertCryptoCurrencyToFiatAmount } from '@app/common/hooks/use-convert-to-fiat-amount';
import { TransactionFee } from '@app/components/fee-row/components/transaction-fee';

import { ConfirmationDetail } from '../../components/confirmation/components/confirmation-detail';
import { ConfirmationDetailsLayout } from '../../components/confirmation/components/confirmation-details.layout';
import { convertToMoneyTypeWithDefaultOfZero } from '../../components/confirmation/send-form-confirmation.utils';

// TODO: Extract details from unsigned tx
interface BtcSendFormConfirmationDetailsProps {
  unsignedTx: Psbt;
}
export function BtcSendFormConfirmationDetails(props: BtcSendFormConfirmationDetailsProps) {
  const { unsignedTx } = props;
  logger.debug('unsigned bitcoin tx', unsignedTx);

  const convertFeeToUsd = useConvertCryptoCurrencyToFiatAmount('BTC');

  const amount = convertToMoneyTypeWithDefaultOfZero('BTC', 0);
  const fee = convertToMoneyTypeWithDefaultOfZero('BTC', 0);
  const recipient = '';

  const feeInUsd = useMemo(() => convertFeeToUsd(fee), [convertFeeToUsd, fee]);

  return (
    <ConfirmationDetailsLayout amount={amount}>
      <ConfirmationDetail detail="Token" value="Bitcoin" />
      <ConfirmationDetail detail="To" value={recipient} />
      <ConfirmationDetail detail="Memo" value="No memo" />
      <ConfirmationDetail
        detail="Fee"
        value={<TransactionFee fee={fee.amount.toString()} usdAmount={feeInUsd} />}
      />
      <ConfirmationDetail detail="Nonce" value="0" />
    </ConfirmationDetailsLayout>
  );
}
