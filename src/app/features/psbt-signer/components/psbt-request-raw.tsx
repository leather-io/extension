import { useState } from 'react';

import { Json } from '@app/components/json';
import { RawPsbt } from '@app/features/psbt-signer/hooks/use-psbt-signer';

import { PsbtRequestDetailsSectionHeader } from './psbt-request-details-section-header';
import { PsbtRequestDetailsSectionLayout } from './psbt-request-details-section.layout';

export function PsbtRequestRaw({ psbt }: { psbt: RawPsbt }) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <PsbtRequestDetailsSectionLayout>
      <PsbtRequestDetailsSectionHeader
        hasDetails
        onSetShowDetails={(value: boolean) => setShowDetails(value)}
        showDetails={showDetails}
        title="Raw transaction"
      />
      {showDetails ? <Json value={psbt} /> : null}
    </PsbtRequestDetailsSectionLayout>
  );
}
