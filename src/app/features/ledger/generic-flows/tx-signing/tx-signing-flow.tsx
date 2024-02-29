import { Outlet, useNavigate } from 'react-router-dom';

import { useLocationState } from '@app/common/hooks/use-location-state';
import { useScrollLock } from '@app/common/hooks/use-scroll-lock';
import { Dialog } from '@app/ui/components/containers/dialog/dialog';
import { Header } from '@app/ui/components/containers/headers/header';

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
  const navigate = useNavigate();
  useScrollLock(true);
  const allowUserToGoBack = useLocationState<boolean>('goBack');
  const canUserCancelAction = useActionCancellableByUser();

  return (
    <LedgerTxSigningProvider value={context}>
      <Dialog
        onGoBack={allowUserToGoBack ? () => navigate(-1) : undefined}
        isShowing
        header={
          <Header
            variant="dialog"
            isWaitingOnPerformedAction={awaitingDeviceConnection || canUserCancelAction}
          />
        }
        onClose={closeAction}
      >
        <Outlet />
      </Dialog>
    </LedgerTxSigningProvider>
  );
}
