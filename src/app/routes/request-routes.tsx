import { Suspense } from 'react';
import { Route } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';

import { BroadcastErrorSheet } from '@app/components/broadcast-error-dialog/broadcast-error-dialog';
import { EditNonceSheet } from '@app/features/dialogs/edit-nonce-dialog/edit-nonce-dialog';
import { ledgerStacksMessageSigningRoutes } from '@app/features/ledger/flows/stacks-message-signing/ledger-stacks-sign-msg.routes';
import { ledgerStacksTxSigningRoutes } from '@app/features/ledger/flows/stacks-tx-signing/ledger-sign-stacks-tx-container';
import { StacksHighFeeWarningContainer } from '@app/features/stacks-high-fee-warning/stacks-high-fee-warning-container';
import { PsbtRequest } from '@app/pages/psbt-request/psbt-request';
import { SignStacksMessageRequest } from '@app/pages/sign-stacks-message-request/sign-stacks-message-request';
import { TransactionRequest } from '@app/pages/transaction-request/transaction-request';
import { ProfileUpdateRequest } from '@app/pages/update-profile-request/update-profile-request';
import { AccountGate } from '@app/routes/account-gate';
import { SuspenseLoadingSpinner } from '@app/routes/app-routes';

export const legacyRequestRoutes = (
  <>
    <Route
      path={RouteUrls.TransactionRequest}
      element={
        <AccountGate>
          <Suspense fallback={<SuspenseLoadingSpinner />}>
            <StacksHighFeeWarningContainer>
              <TransactionRequest />
            </StacksHighFeeWarningContainer>
          </Suspense>
        </AccountGate>
      }
    >
      {ledgerStacksTxSigningRoutes}
      <Route path={RouteUrls.EditNonce} element={<EditNonceSheet />} />
      <Route path={RouteUrls.TransactionBroadcastError} element={<BroadcastErrorSheet />} />
    </Route>
    <Route
      path={RouteUrls.SignatureRequest}
      element={
        <AccountGate>
          <Suspense fallback={<SuspenseLoadingSpinner />}>
            <SignStacksMessageRequest />
          </Suspense>
        </AccountGate>
      }
    >
      {ledgerStacksMessageSigningRoutes}
    </Route>
    <Route
      path={RouteUrls.ProfileUpdateRequest}
      element={
        <AccountGate>
          <Suspense fallback={<SuspenseLoadingSpinner />}>
            <ProfileUpdateRequest />
          </Suspense>
        </AccountGate>
      }
    />
    <Route
      path={RouteUrls.PsbtRequest}
      element={
        <AccountGate>
          <Suspense fallback={<SuspenseLoadingSpinner />}>
            <PsbtRequest />
          </Suspense>
        </AccountGate>
      }
    />
  </>
);
