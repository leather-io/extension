import { Route } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';

import { BroadcastErrorSheet } from '@app/components/broadcast-error-dialog/broadcast-error-dialog';
import { CurrentStacksAccountLoader } from '@app/components/loaders/stacks-account-loader';
import { ledgerStacksTxSigningRoutes } from '@app/features/ledger/flows/stacks-tx-signing/ledger-sign-stacks-tx-container';
import { NonceEditor } from '@app/features/nonce-editor/nonce-editor';
import { AccountGate } from '@app/routes/account-gate';
import { LedgerStacksGate } from '@app/routes/ledger-stacks-gate';

import { FeeEditor } from '../../features/fee-editor/fee-editor';
import { RpcStxTransferSip10Ft } from './rpc-stx-transfer-sip10-ft';
import { RpcStxTransferSip10FtContainer } from './rpc-stx-transfer-sip10-ft-container';

export const rpcStxTransferSip10FtRoutes = (
  <Route
    path={RouteUrls.RpcStxTransferSip10Ft}
    element={
      <AccountGate>
        <LedgerStacksGate>
          <CurrentStacksAccountLoader>
            {account => <RpcStxTransferSip10FtContainer account={account} />}
          </CurrentStacksAccountLoader>
        </LedgerStacksGate>
      </AccountGate>
    }
  >
    <Route index element={<RpcStxTransferSip10Ft />} />
    <Route path={RouteUrls.FeeEditor} element={<FeeEditor />} />
    <Route path={RouteUrls.NonceEditor} element={<NonceEditor />} />
    <Route path={RouteUrls.BroadcastError} element={<BroadcastErrorSheet />} />
    {ledgerStacksTxSigningRoutes}
  </Route>
);
