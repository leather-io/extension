import { Route } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';

import { ledgerBitcoinTxSigningRoutes } from '@app/features/ledger/flows/bitcoin-tx-signing/ledger-bitcoin-sign-tx-container';
import { ConnectLedgerBitcoin } from '@app/features/ledger/generic-steps/connect-device/connect-ledger-bitcoin';
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
        <LedgerBitcoinGate fallback={<ConnectLedgerBitcoin />}>
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
