import { Outlet } from 'react-router-dom';

import { useScrollLock } from '@app/common/hooks/use-scroll-lock';
import { Dialog } from '@app/ui/components/containers/dialog/dialog';
import { DialogHeader } from '@app/ui/components/containers/headers/dialog-header';

import { useActionCancellableByUser } from '../../utils/stacks-ledger-utils';
import { LedgerTxSigningContext, LedgerTxSigningProvider } from './ledger-sign-tx.context';

interface TxSigningFlowProps {
  context: LedgerTxSigningContext;
  awaitingDeviceConnection: boolean;
  closeAction(): void;
}
export function TxSigningFlow({
  context,
  awaitingDeviceConnection,
  closeAction,
}: TxSigningFlowProps) {
  useScrollLock(true);
  const canUserCancelAction = useActionCancellableByUser();

  const canClose = !awaitingDeviceConnection && canUserCancelAction;
  return (
    <LedgerTxSigningProvider value={context}>
      <Dialog isShowing header={<DialogHeader />} onClose={canClose ? closeAction : undefined}>
        <Outlet />
      </Dialog>
    </LedgerTxSigningProvider>
  );
}
