import { Route } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';

import { ledgerBitcoinTxSigningRoutes } from '@app/features/ledger/flows/bitcoin-tx-signing/ledger-bitcoin-sign-tx-container';
import { AccountGate } from '@app/routes/account-gate';

import { FeeEditor } from '../../features/fee-editor/fee-editor';
import { RpcSendTransfer } from './rpc-send-transfer';
import { RpcSendTransferContainer } from './rpc-send-transfer-container';

export const rpcSendTransferRoutes = (
  <Route
    element={
      <AccountGate>
        <RpcSendTransferContainer />
      </AccountGate>
    }
  >
    <Route path={RouteUrls.RpcSendTransfer} element={<RpcSendTransfer />}>
      {ledgerBitcoinTxSigningRoutes}
    </Route>
    <Route path={RouteUrls.EditFee} element={<FeeEditor />} />
  </Route>
);
