import { createMoney } from '@shared/models/money.model';

import { formatMoney } from '@app/common/money/format-money';
import { Pill } from '@app/components/pill';
import { PsbtOutput } from '@app/features/psbt-signer/hooks/use-parsed-outputs';
import { truncateMiddle } from '@app/ui/utils/truncate-middle';

import { PsbtInputOutputItemLayout } from '../../psbt-input-output-item.layout';

const pillHoverLabel = 'Value you’ll receive after this transaction is complete.';

export function PsbtOutputItem({ output }: { output: PsbtOutput }) {
  const isUnknownAddress = output.address === 'unknown';

  if (isUnknownAddress) return null;

  return (
    <PsbtInputOutputItemLayout
      address={truncateMiddle(output.address)}
      addressHoverLabel={output.address}
      amount={formatMoney(createMoney(Number(output.value), 'BTC'))}
      label={output.toSign ? <Pill hoverLabel={pillHoverLabel} label="You" /> : undefined}
    />
  );
}
