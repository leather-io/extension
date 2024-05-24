import { truncateMiddle } from '@leather-wallet/utils';

import { createMoney } from '@shared/models/money.model';

import { formatMoney } from '@app/common/money/format-money';
import { PsbtInput } from '@app/features/psbt-signer/hooks/use-parsed-inputs';
import { TagWithTooltip } from '@app/ui/components/tag/tag-with-tooltip';

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
