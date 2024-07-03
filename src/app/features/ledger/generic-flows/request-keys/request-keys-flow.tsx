import { Outlet } from 'react-router-dom';

import { Dialog } from '@leather.io/ui';

import { useScrollLock } from '@app/common/hooks/use-scroll-lock';
import { DialogHeader } from '@app/features/container/containers/headers/dialog-header';

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
