import { truncateMiddle } from '@leather-wallet/utils';

import { createMoney } from '@shared/models/money.model';

import { formatMoney } from '@app/common/money/format-money';
import { PsbtOutput } from '@app/features/psbt-signer/hooks/use-parsed-outputs';
import { TagWithTooltip } from '@app/ui/components/tag/tag-with-tooltip';

import { PsbtInputOutputItemLayout } from '../../psbt-input-output-item.layout';

const hoverLabel = 'Value you’ll receive after this transaction is complete.';

export function PsbtOutputItem({ output }: { output: PsbtOutput }) {
  const isUnknownAddress = output.address === 'unknown';

  if (isUnknownAddress) return null;

  return (
    <PsbtInputOutputItemLayout
      address={truncateMiddle(output.address)}
      addressHoverLabel={output.address}
      amount={formatMoney(createMoney(Number(output.value), 'BTC'))}
      label={
        output.toSign ? (
          <TagWithTooltip transparent hoverLabel={hoverLabel} label="You" />
        ) : undefined
      }
    />
  );
}
