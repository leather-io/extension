import { useMemo } from 'react';

import { truncateMiddle } from '@stacks/ui-utils';
import BigNumber from 'bignumber.js';
import * as btc from 'micro-btc-signer';

import { Money } from '@shared/models/money.model';

import { useConvertCryptoCurrencyToFiatAmount } from '@app/common/hooks/use-convert-to-fiat-amount';
import { formatMoney } from '@app/common/money/format-money';

import { ConfirmationDetail } from '../../components/confirmation/components/confirmation-detail';
import { ConfirmationDetailsLayout } from '../../components/confirmation/components/confirmation-details.layout';
import { convertToMoneyTypeWithDefaultOfZero } from '../../components/confirmation/send-form-confirmation.utils';
import { TransactionFee } from '../../components/transaction-fee';

interface BtcSendFormConfirmationDetailsProps {
  unsignedTx: ReturnType<typeof btc.RawTx.decode>;
  recipient: string;
  fee: Money;
}
export function BtcSendFormConfirmationDetails(props: BtcSendFormConfirmationDetailsProps) {
  const { unsignedTx, recipient, fee } = props;

  const convertFeeToUsd = useConvertCryptoCurrencyToFiatAmount('BTC');

  const amount = convertToMoneyTypeWithDefaultOfZero(
    'BTC',
    new BigNumber(unsignedTx.outputs[0].amount.toString())
  );

  const feeInUsd = useMemo(() => convertFeeToUsd(fee), [convertFeeToUsd, fee]);

  return (
    <ConfirmationDetailsLayout amount={amount}>
      <ConfirmationDetail detail="Token" value="Bitcoin" />
      <ConfirmationDetail detail="To" value={truncateMiddle(recipient, 4)} />
      <ConfirmationDetail
        detail="Fee"
        value={<TransactionFee fee={formatMoney(fee)} usdAmount={feeInUsd} />}
      />
    </ConfirmationDetailsLayout>
  );
}
