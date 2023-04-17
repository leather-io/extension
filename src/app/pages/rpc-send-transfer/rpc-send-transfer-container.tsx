import { Outlet } from 'react-router-dom';

import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { PopupHeader } from '@app/features/current-account/popup-header';

import { RpcSendTransferContainerLayout } from './components/rpc-send-transfer-container.layout';
import { useRpcSendTransfer } from './use-rpc-send-transfer';

export function RpcSendTransferContainer() {
  const { origin } = useRpcSendTransfer();

  useRouteHeader(<PopupHeader displayAddresssBalanceOf="all" />);

  if (origin === null) {
    window.close();
    throw new Error('Origin is null');
  }

  return (
    <RpcSendTransferContainerLayout>
      <Outlet />
    </RpcSendTransferContainerLayout>
  );
}
