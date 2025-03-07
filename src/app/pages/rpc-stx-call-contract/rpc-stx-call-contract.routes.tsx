import { Route } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';

import { BroadcastErrorSheet } from '@app/components/broadcast-error-dialog/broadcast-error-dialog';
import { ledgerBitcoinTxSigningRoutes } from '@app/features/ledger/flows/bitcoin-tx-signing/ledger-bitcoin-sign-tx-container';
import { NonceEditor } from '@app/features/nonce-editor/nonce-editor';
import { AccountGate } from '@app/routes/account-gate';

import { FeeEditor } from '../../features/fee-editor/fee-editor';
import { RpcStxCallContract } from './rpc-stx-call-contract';
import { RpcStxCallContractContainer } from './rpc-stx-call-contract-container';

export const rpcStxCallContractRoutes = (
  <Route
    element={
      <AccountGate>
        <RpcStxCallContractContainer />
      </AccountGate>
    }
  >
    <Route path={RouteUrls.RpcStxCallContract} element={<RpcStxCallContract />}>
      {ledgerBitcoinTxSigningRoutes}
    </Route>
    <Route path={RouteUrls.FeeEditor} element={<FeeEditor />} />
    <Route path={RouteUrls.NonceEditor} element={<NonceEditor />} />
    <Route path={RouteUrls.BroadcastError} element={<BroadcastErrorSheet />} />
  </Route>
);
