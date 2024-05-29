import { Outlet } from 'react-router-dom';

import { Dialog, DialogHeader } from '@leather-wallet/ui';

import { useScrollLock } from '@app/common/hooks/use-scroll-lock';

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
