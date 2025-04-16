import { Route } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';

import { BroadcastErrorSheet } from '@app/components/broadcast-error-dialog/broadcast-error-dialog';
import { ledgerStacksTxSigningRoutes } from '@app/features/ledger/flows/stacks-tx-signing/ledger-sign-stacks-tx-container';
import { NonceEditor } from '@app/features/nonce-editor/nonce-editor';
import { AccountGate } from '@app/routes/account-gate';
import { LedgerStacksGate } from '@app/routes/ledger-stacks-gate';

import { FeeEditor } from '../../features/fee-editor/fee-editor';
import { RpcStxTransferStx } from './rpc-stx-transfer-stx';
import { RpcStxTransferStxContainer } from './rpc-stx-transfer-stx-container';

export const rpcStxTransferStxRoutes = (
  <Route
    path={RouteUrls.RpcStxTransferStx}
    element={
      <AccountGate>
        <LedgerStacksGate>
          <RpcStxTransferStxContainer />
        </LedgerStacksGate>
      </AccountGate>
    }
  >
    <Route index element={<RpcStxTransferStx />} />
    <Route path={RouteUrls.FeeEditor} element={<FeeEditor />} />
    <Route path={RouteUrls.NonceEditor} element={<NonceEditor />} />
    <Route path={RouteUrls.BroadcastError} element={<BroadcastErrorSheet />} />
    {ledgerStacksTxSigningRoutes}
  </Route>
);
