import { createMoney, truncateMiddle } from '@leather.io/utils';

import { formatCurrency } from '@app/common/currency-formatter';
import { PsbtOutput } from '@app/features/psbt-signer/hooks/use-parsed-outputs';
import { BadgeWithTooltip } from '@app/ui/components/badge/badge-with-tooltip';

import { PsbtInputOutputItemLayout } from '../../psbt-input-output-item.layout';

const hoverLabel = 'Value you’ll receive after this transaction is complete.';

export function PsbtOutputItem({ output }: { output: PsbtOutput }) {
  if (output.address === null) return null;

  return (
    <PsbtInputOutputItemLayout
      address={truncateMiddle(output.address)}
      addressHoverLabel={output.address}
      amount={formatCurrency(createMoney(Number(output.value), 'BTC'))}
      label={
        output.toSign ? (
          <BadgeWithTooltip outlined hoverLabel={hoverLabel} label="You" />
        ) : undefined
      }
    />
  );
}
