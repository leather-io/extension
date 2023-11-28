import { useState } from 'react';

import { WarningLabel } from '@app/components/warning-label';
import { useOnOriginTabClose } from '@app/routes/hooks/use-on-tab-closed';

export function RequestingTabClosedWarningMessage() {
  const [hasTabClosed, setHasTabClosed] = useState(false);

  useOnOriginTabClose(() => {
    setHasTabClosed(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  if (!hasTabClosed) return null;

  return (
    <WarningLabel mb="space.05" title="Requesting window closed" width="100%">
      The window making this request closed, but you can still broadcast the transaction
    </WarningLabel>
  );
}
