import { useState } from 'react';

import { useOnOriginTabClose } from '@app/routes/hooks/use-on-tab-closed';
import { Callout } from '@app/ui/components/callout/callout';

export function RequestingTabClosedWarningMessage() {
  const [hasTabClosed, setHasTabClosed] = useState(false);

  useOnOriginTabClose(() => {
    setHasTabClosed(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  if (!hasTabClosed) return null;

  return (
    <Callout variant="warning" mb="space.05" title="Requesting window closed" width="100%">
      The window making this request closed, but you can still broadcast the transaction
    </Callout>
  );
}
