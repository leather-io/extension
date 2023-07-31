import { useState } from 'react';

import { usePsbtSignerContext } from '@app/features/psbt-signer/psbt-signer.context';

import { PsbtRequestDetailsSectionHeader } from '../psbt-request-details-section-header';
import { PsbtRequestDetailsSectionLayout } from '../psbt-request-details-section.layout';
import { PsbtInputList } from './components/psbt-input-list/psbt-input-list';
import { PsbtOutputList } from './components/psbt-output-list/psbt-output-list';

export function PsbtInputsAndOutputs() {
  const { psbtInputs, psbtOutputs } = usePsbtSignerContext();
  const [showDetails, setShowDetails] = useState(false);

  if (!psbtInputs.length || !psbtOutputs.length) return null;

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
          <PsbtInputList inputs={psbtInputs} />
          <PsbtRequestDetailsSectionHeader title="Outputs" />
          <PsbtOutputList outputs={psbtOutputs} />
        </>
      ) : null}
    </PsbtRequestDetailsSectionLayout>
  );
}
