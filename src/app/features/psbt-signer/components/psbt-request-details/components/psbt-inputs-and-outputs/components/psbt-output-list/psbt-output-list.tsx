import { PsbtOutput } from '@app/features/psbt-signer/hooks/use-parsed-outputs';

import { PsbtOutputItem } from './components/psbt-output-item';
import { PsbtOutputListLayout } from './components/psbt-output-list.layout';

interface PsbtOutputListProps {
  addressNativeSegwit: string;
  addressTaproot: string;
  outputs: PsbtOutput[];
}
export function PsbtOutputList({
  addressNativeSegwit,
  addressTaproot,
  outputs,
}: PsbtOutputListProps) {
  return (
    <PsbtOutputListLayout>
      {outputs.map((output, i) => (
        <PsbtOutputItem
          addressNativeSegwit={addressNativeSegwit}
          addressTaproot={addressTaproot}
          key={i}
          output={output}
        />
      ))}
    </PsbtOutputListLayout>
  );
}
