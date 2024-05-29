import { TagWithTooltip } from '@leather-wallet/ui';
import { createMoney, formatMoney, truncateMiddle } from '@leather-wallet/utils';

import { PsbtInput } from '@app/features/psbt-signer/hooks/use-parsed-inputs';

import { PsbtInputOutputItemLayout } from '../../psbt-input-output-item.layout';

const hoverLabel = `Value you're approving as contribution to transaction.`;

export function PsbtInputItem({ utxo }: { utxo: PsbtInput }) {
  return (
    <PsbtInputOutputItemLayout
      address={truncateMiddle(utxo.address)}
      addressHoverLabel={utxo.address}
      amount={formatMoney(createMoney(utxo.value, 'BTC'))}
      label={
        utxo.toSign ? (
          <TagWithTooltip hoverLabel={hoverLabel} label="Approve" transparent />
        ) : undefined
      }
      txId={truncateMiddle(utxo.txid)}
      txIdHoverLabel={utxo.txid}
    />
  );
}
