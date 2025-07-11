import { Route } from 'react-router';

import { RouteUrls } from '@shared/route-urls';

import { BroadcastErrorSheet } from '@app/components/broadcast-error-dialog/broadcast-error-dialog';
import { FeeEditor } from '@app/features/fee-editor/fee-editor';
import { ledgerStacksTxSigningRoutes } from '@app/features/ledger/flows/stacks-tx-signing/ledger-sign-stacks-tx-container';
import { NonceEditor } from '@app/features/nonce-editor/nonce-editor';
import { AccountGate } from '@app/routes/account-gate';
import { LedgerStacksGate } from '@app/routes/ledger-stacks-gate';

interface GenerateStacksRpcTransactionRequestRoutesArgs {
  path: string;
  container: React.ReactNode;
  element: React.ReactNode;
}
export function generateStacksRpcTransactionRequestRoutes({
  path,
  container,
  element,
}: GenerateStacksRpcTransactionRequestRoutesArgs) {
  return (
    <Route
      path={path}
      element={
        <AccountGate>
          <LedgerStacksGate>{container}</LedgerStacksGate>
        </AccountGate>
      }
    >
      <Route index element={element} />
      <Route path={RouteUrls.FeeEditor} element={<FeeEditor />} />
      <Route path={RouteUrls.NonceEditor} element={<NonceEditor />} />
      <Route path={RouteUrls.BroadcastError} element={<BroadcastErrorSheet />} />
      {ledgerStacksTxSigningRoutes}
    </Route>
  );
}
