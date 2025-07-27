import { createMoney, truncateMiddle } from '@leather.io/utils';

import { formatCurrency } from '@app/common/currency-formatter';
import { PsbtInput } from '@app/features/psbt-signer/hooks/use-parsed-inputs';
import { BadgeWithTooltip } from '@app/ui/components/badge/badge-with-tooltip';

import { PsbtInputOutputItemLayout } from '../../psbt-input-output-item.layout';

const hoverLabel = `Value you're approving as contribution to transaction.`;

export function PsbtInputItem({ utxo }: { utxo: PsbtInput }) {
  if (utxo.address === null) return null;

  return (
    <PsbtInputOutputItemLayout
      address={truncateMiddle(utxo.address)}
      addressHoverLabel={utxo.address}
      amount={formatCurrency(createMoney(utxo.value, 'BTC'))}
      label={
        utxo.toSign ? (
          <BadgeWithTooltip hoverLabel={hoverLabel} label="Approve" outlined />
        ) : undefined
      }
      txId={truncateMiddle(utxo.txid)}
      txIdHoverLabel={utxo.txid}
    />
  );
}
