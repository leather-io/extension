import { Route } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';

import { BroadcastErrorSheet } from '@app/components/broadcast-error-dialog/broadcast-error-dialog';
import { ledgerStacksTxSigningRoutes } from '@app/features/ledger/flows/stacks-tx-signing/ledger-sign-stacks-tx-container';
import { ConnectLedgerStacks } from '@app/features/ledger/generic-steps/connect-device/connect-ledger-stacks';
import { NonceEditor } from '@app/features/nonce-editor/nonce-editor';
import { AccountGate } from '@app/routes/account-gate';
import { LedgerStacksGate } from '@app/routes/ledger-stacks-gate';

import { FeeEditor } from '../../features/fee-editor/fee-editor';
import { RpcStxCallContract } from './rpc-stx-call-contract';
import { RpcStxCallContractContainer } from './rpc-stx-call-contract-container';

export const rpcStxCallContractRoutes = (
  <Route
    path={RouteUrls.RpcStxCallContract}
    element={
      <AccountGate>
        <LedgerStacksGate fallback={<ConnectLedgerStacks />}>
          <RpcStxCallContractContainer />
        </LedgerStacksGate>
      </AccountGate>
    }
  >
    <Route index element={<RpcStxCallContract />} />
    <Route path={RouteUrls.FeeEditor} element={<FeeEditor />} />
    <Route path={RouteUrls.NonceEditor} element={<NonceEditor />} />
    <Route path={RouteUrls.BroadcastError} element={<BroadcastErrorSheet />} />
    {ledgerStacksTxSigningRoutes}
  </Route>
);
