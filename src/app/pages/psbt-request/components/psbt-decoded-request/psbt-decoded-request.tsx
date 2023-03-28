import { useState } from 'react';

import { Stack, color } from '@stacks/ui';

import { PsbtDecodedRequestAdvanced } from './psbt-decoded-request-views/psbt-decoded-request-advanced';
import { PsbtDecodedRequestSimple } from './psbt-decoded-request-views/psbt-decoded-request-simple';
import { PsbtDecodedRequestViewToggle } from './psbt-decoded-request-views/psbt-decoded-request-view-toggle';

interface PsbtDecodedRequestProps {
  psbt: any;
}
export function PsbtDecodedRequest({ psbt }: PsbtDecodedRequestProps) {
  const [showAdvancedView, setShowAdvancedView] = useState(false);

  return (
    <Stack
      backgroundColor={color('border')}
      border="4px solid"
      borderColor={color('border')}
      borderRadius="20px"
      paddingBottom="tight"
      spacing="extra-tight"
    >
      {showAdvancedView ? (
        <PsbtDecodedRequestAdvanced psbt={psbt} />
      ) : (
        <PsbtDecodedRequestSimple psbt={psbt} />
      )}
      <PsbtDecodedRequestViewToggle
        onSetShowAdvancedView={() => setShowAdvancedView(!showAdvancedView)}
        showAdvancedView={showAdvancedView}
      />
    </Stack>
  );
}
