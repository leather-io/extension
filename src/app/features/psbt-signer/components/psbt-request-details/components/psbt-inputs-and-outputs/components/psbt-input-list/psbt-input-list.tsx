import { PsbtInput } from '@app/features/psbt-signer/hooks/use-parsed-inputs';

import { PsbtInputItem } from './components/psbt-input-item';
import { PsbtInputListLayout } from './components/psbt-input-list.layout';

export function PsbtInputList({ inputs }: { inputs: PsbtInput[] }) {
  return (
    <PsbtInputListLayout>
      {inputs.map((input, i) => (
        <PsbtInputItem key={i} utxo={input} />
      ))}
    </PsbtInputListLayout>
  );
}
