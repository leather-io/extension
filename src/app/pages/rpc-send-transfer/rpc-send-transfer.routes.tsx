import { Route } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';

import { AccountGate } from '@app/routes/account-gate';

import { RpcSendTransfer } from './rpc-send-transfer';
import { RpcSendTransferChooseFee } from './rpc-send-transfer-choose-fee';
import { RpcSendTransferConfirmation } from './rpc-send-transfer-confirmation';
import { RpcSendTransferContainer } from './rpc-send-transfer-container';
import { RpcSendTransferSummary } from './rpc-send-transfer-summary';

export const rpcSendTransferRoutes = (
  <Route
    element={
      <AccountGate>
        <RpcSendTransferContainer />
      </AccountGate>
    }
  >
    <Route path={RouteUrls.RpcSendTransfer} element={<RpcSendTransfer />} />
    <Route path={RouteUrls.RpcSendTransferChooseFee} element={<RpcSendTransferChooseFee />} />
    <Route path={RouteUrls.RpcSendTransferConfirmation} element={<RpcSendTransferConfirmation />} />
    <Route path={RouteUrls.RpcSendTransferSummary} element={<RpcSendTransferSummary />} />
  </Route>
);
