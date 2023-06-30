import { truncateMiddle } from '@stacks/ui-utils';

import { createMoney } from '@shared/models/money.model';

import { formatMoney } from '@app/common/money/format-money';
import { PsbtOutput } from '@app/features/psbt-signer/hooks/use-parsed-outputs';

import { PsbtInputOutputItemLayout } from '../../psbt-input-output-item.layout';

const pillHoverLabel = 'Value you’ll receive after this transaction is complete.';

interface PsbtOutputItemProps {
  addressNativeSegwit: string;
  addressTaproot: string;
  output: PsbtOutput;
}
export function PsbtOutputItem({
  addressNativeSegwit,
  addressTaproot,
  output,
}: PsbtOutputItemProps) {
  const isOutputCurrentAddress =
    output.address === addressNativeSegwit || output.address === addressTaproot;

  return (
    <PsbtInputOutputItemLayout
      address={truncateMiddle(output.address)}
      addressHoverLabel={output.address}
      amount={formatMoney(createMoney(Number(output.value), 'BTC'))}
      pillHoverLabel={isOutputCurrentAddress ? pillHoverLabel : undefined}
      pillLabel={isOutputCurrentAddress ? <>You</> : undefined}
    />
  );
}
