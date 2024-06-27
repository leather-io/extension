import { Outlet } from 'react-router-dom';

import { Dialog } from '@leather.io/ui';

import { useScrollLock } from '@app/common/hooks/use-scroll-lock';
import { DialogHeader } from '@app/ui/components/containers/headers/dialog-header';

import { LedgerTxSigningContext, LedgerTxSigningProvider } from './ledger-sign-tx.context';

interface TxSigningFlowProps {
  context: LedgerTxSigningContext;
  closeAction?(): void;
}
export function TxSigningFlow({ context, closeAction }: TxSigningFlowProps) {
  useScrollLock(true);
  return (
    <LedgerTxSigningProvider value={context}>
      <Dialog isShowing header={<DialogHeader />} onClose={closeAction}>
        <Outlet />
      </Dialog>
    </LedgerTxSigningProvider>
  );
}
