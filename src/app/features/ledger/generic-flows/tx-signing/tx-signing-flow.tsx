import { Outlet } from 'react-router-dom';

import { useLocationState } from '@app/common/hooks/use-location-state';
import { useScrollLock } from '@app/common/hooks/use-scroll-lock';
import { BaseDrawer } from '@app/components/drawer/base-drawer';

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
  const allowUserToGoBack = useLocationState<boolean>('goBack');
  const canUserCancelAction = useActionCancellableByUser();

  return (
    <LedgerTxSigningProvider value={context}>
      <BaseDrawer
        enableGoBack={allowUserToGoBack}
        isShowing
        isWaitingOnPerformedAction={awaitingDeviceConnection || canUserCancelAction}
        onClose={closeAction}
        pauseOnClickOutside
        waitingOnPerformedActionMessage="Ledger device in use"
      >
        <Outlet />
      </BaseDrawer>
    </LedgerTxSigningProvider>
  );
}
