import { truncateMiddle } from '@stacks/ui-utils';

import { createMoney } from '@shared/models/money.model';

import { formatMoney } from '@app/common/money/format-money';
import { Pill } from '@app/components/pill';
import { PsbtOutput } from '@app/features/psbt-signer/hooks/use-parsed-outputs';

import { PsbtInputOutputItemLayout } from '../../psbt-input-output-item.layout';

const pillHoverLabel = 'Value you’ll receive after this transaction is complete.';

export function PsbtOutputItem({ output }: { output: PsbtOutput }) {
  return (
    <PsbtInputOutputItemLayout
      address={truncateMiddle(output.address)}
      addressHoverLabel={output.address}
      amount={formatMoney(createMoney(Number(output.value), 'BTC'))}
      label={output.toSign ? <Pill hoverLabel={pillHoverLabel} label="You" /> : undefined}
    />
  );
}
