import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';

import { useScrollLock } from '@app/common/hooks/use-scroll-lock';
import { Dialog } from '@app/ui/components/containers/dialog/dialog';
import { DialogHeader } from '@app/ui/components/containers/headers/dialog-header';

import { useActionCancellableByUser } from '../../utils/stacks-ledger-utils';
import { LedgerTxSigningContext, LedgerTxSigningProvider } from './ledger-sign-tx.context';

interface TxSigningFlowProps {
  context: LedgerTxSigningContext;
  awaitingDeviceConnection: boolean;
}
export function TxSigningFlow({ context, awaitingDeviceConnection }: TxSigningFlowProps) {
  const navigate = useNavigate();
  const location = useLocation();
  useScrollLock(true);
  const canUserCancelAction = useActionCancellableByUser();

  return (
    <LedgerTxSigningProvider value={context}>
      <Dialog
        isShowing
        header={
          <DialogHeader
            isWaitingOnPerformedAction={awaitingDeviceConnection || canUserCancelAction}
          />
        }
        onClose={() =>
          // navigate to specific route instead of `..` to avoid redirect to Home
          navigate(RouteUrls.RpcSignBip322Message, { state: { ...location.state, wentBack: true } })
        }
      >
        <Outlet />
      </Dialog>
    </LedgerTxSigningProvider>
  );
}
