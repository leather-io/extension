import { PsbtOutput } from '@app/features/psbt-signer/hooks/use-parsed-outputs';

import { PsbtOutputItem } from './components/psbt-output-item';
import { PsbtOutputListLayout } from './components/psbt-output-list.layout';

export function PsbtOutputList({ outputs }: { outputs: PsbtOutput[] }) {
  return (
    <PsbtOutputListLayout>
      {outputs.map((output, i) => (
        <PsbtOutputItem key={i} output={output} />
      ))}
    </PsbtOutputListLayout>
  );
}
