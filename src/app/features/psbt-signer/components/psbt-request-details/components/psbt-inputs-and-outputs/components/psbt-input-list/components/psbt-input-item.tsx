import { truncateMiddle } from '@stacks/ui-utils';

import { createMoney } from '@shared/models/money.model';

import { formatMoney } from '@app/common/money/format-money';
import { PsbtInput } from '@app/features/psbt-signer/hooks/use-parsed-inputs';

import { PsbtInputOutputItemLayout } from '../../psbt-input-output-item.layout';

const pillHoverLabel = 'Your approval is needed to complete this transaction.';

export function PsbtInputItem(props: { utxo: PsbtInput }) {
  const { utxo } = props;

  return (
    <PsbtInputOutputItemLayout
      address={truncateMiddle(utxo.address)}
      addressHoverLabel={utxo.address}
      amount={formatMoney(createMoney(utxo.value, 'BTC'))}
      pillHoverLabel={utxo.sign ? pillHoverLabel : undefined}
      pillLabel={utxo.sign ? <>Approve</> : undefined}
      txId={truncateMiddle(utxo.txid)}
      txIdHoverLabel={utxo.txid}
    />
  );
}
