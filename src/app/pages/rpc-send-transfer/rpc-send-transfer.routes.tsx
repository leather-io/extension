import { Route } from 'react-router';

import { RouteUrls } from '@shared/route-urls';

import { ledgerBitcoinTxSigningRoutes } from '@app/features/ledger/flows/bitcoin-tx-signing/ledger-bitcoin-sign-tx-container';
import { AccountGate } from '@app/routes/account-gate';
import { LedgerBitcoinGate } from '@app/routes/ledger-bitcoin-gate';

import { FeeEditor } from '../../features/fee-editor/fee-editor';
import { RpcSendTransfer } from './rpc-send-transfer';
import { RpcSendTransferContainer } from './rpc-send-transfer-container';

export const rpcSendTransferRoutes = (
  <Route
    path={RouteUrls.RpcSendTransfer}
    element={
      <AccountGate>
        <LedgerBitcoinGate>
          <RpcSendTransferContainer />
        </LedgerBitcoinGate>
      </AccountGate>
    }
  >
    <Route index element={<RpcSendTransfer />} />
    <Route path={RouteUrls.FeeEditor} element={<FeeEditor />} />
    {ledgerBitcoinTxSigningRoutes}
  </Route>
);
