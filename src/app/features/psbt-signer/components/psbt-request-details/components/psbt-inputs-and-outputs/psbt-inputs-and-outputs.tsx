import { useState } from 'react';

import { PsbtInput } from '@app/features/psbt-signer/hooks/use-parsed-inputs';
import { PsbtOutput } from '@app/features/psbt-signer/hooks/use-parsed-outputs';

import { PsbtRequestDetailsSectionHeader } from '../psbt-request-details-section-header';
import { PsbtRequestDetailsSectionLayout } from '../psbt-request-details-section.layout';
import { PsbtInputList } from './components/psbt-input-list/psbt-input-list';
import { PsbtOutputList } from './components/psbt-output-list/psbt-output-list';

interface PsbtInputsAndOutputsProps {
  inputs: PsbtInput[];
  outputs: PsbtOutput[];
}
export function PsbtInputsAndOutputs({ outputs, inputs }: PsbtInputsAndOutputsProps) {
  const [showDetails, setShowDetails] = useState(false);

  if (!inputs.length || !outputs.length) return null;

  return (
    <PsbtRequestDetailsSectionLayout>
      <PsbtRequestDetailsSectionHeader
        hasDetails
        onSetShowDetails={(value: boolean) => setShowDetails(value)}
        showDetails={showDetails}
        title={showDetails ? 'Inputs' : 'Inputs and Outputs'}
      />
      {showDetails ? (
        <>
          <PsbtInputList inputs={inputs} />
          <PsbtRequestDetailsSectionHeader title="Outputs" />
          <PsbtOutputList outputs={outputs} />
        </>
      ) : null}
    </PsbtRequestDetailsSectionLayout>
  );
}
