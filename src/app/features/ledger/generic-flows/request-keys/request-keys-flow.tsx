import { Outlet } from 'react-router-dom';

import { useScrollLock } from '@app/common/hooks/use-scroll-lock';
import { Dialog } from '@app/ui/components/containers/dialog/dialog';
import { DialogHeader } from '@app/ui/components/containers/headers/dialog-header';

import { useLedgerNavigate } from '../../hooks/use-ledger-navigate';
import { LedgerRequestKeysContext, LedgerRequestKeysProvider } from './ledger-request-keys.context';

interface RequestKeysFlowProps {
  context: LedgerRequestKeysContext;
  isActionCancellableByUser: boolean;
}
export function RequestKeysFlow({ context, isActionCancellableByUser }: RequestKeysFlowProps) {
  const ledgerNavigate = useLedgerNavigate();
  useScrollLock(true);

  const onCancelConnectLedger = ledgerNavigate.cancelLedgerAction;
  >>> check this as not allowing X from connect screen now
  console.log('requestKeys ', onCancelConnectLedger, isActionCancellableByUser); 

  // need to make sure they can 'X' out of failed connect. Maybe I'm better to just lave the greyed out X alone?????
  return (
    <LedgerRequestKeysProvider value={context}>
      <Dialog
        isShowing
        header={<DialogHeader />}
        onClose={isActionCancellableByUser ? onCancelConnectLedger : undefined}
      >
        <Outlet />
      </Dialog>
    </LedgerRequestKeysProvider>
  );
}
