import { Suspense } from 'react';
import {
  Navigate,
  Route,
  RouterProvider,
  createHashRouter,
  createRoutesFromElements,
} from 'react-router-dom';

import * as Sentry from '@sentry/react';

import { RouteUrls } from '@shared/route-urls';

import { LoadingSpinner } from '@app/components/loading-spinner';
import { AddNetwork } from '@app/features/add-network/add-network';
import { Container } from '@app/features/container/container';
import { EditNonceDialog } from '@app/features/dialogs/edit-nonce-dialog/edit-nonce-dialog';
import { leatherIntroDialogRoutes } from '@app/features/dialogs/leather-intro-dialog/leather-intro-dialog';
import { CancelStxTransactionDialog } from '@app/features/dialogs/transaction-action-dialog/cancel-stx-transaction-dialog';
import { IncreaseBtcFeeDialog } from '@app/features/dialogs/transaction-action-dialog/increase-btc-fee-dialog';
import { IncreaseStxFeeDialog } from '@app/features/dialogs/transaction-action-dialog/increase-stx-fee-dialog';
import { RouterErrorBoundary } from '@app/features/errors/app-error-boundary';
import { ledgerBitcoinTxSigningRoutes } from '@app/features/ledger/flows/bitcoin-tx-signing/ledger-bitcoin-sign-tx-container';
import { ledgerJwtSigningRoutes } from '@app/features/ledger/flows/jwt-signing/ledger-sign-jwt.routes';
import { requestBitcoinKeysRoutes } from '@app/features/ledger/flows/request-bitcoin-keys/ledger-request-bitcoin-keys';
import { requestStacksKeysRoutes } from '@app/features/ledger/flows/request-stacks-keys/ledger-request-stacks-keys';
import { ledgerStacksTxSigningRoutes } from '@app/features/ledger/flows/stacks-tx-signing/ledger-sign-stacks-tx-container';
import { UnsupportedBrowserLayout } from '@app/features/ledger/generic-steps';
import { ConnectLedgerStart } from '@app/features/ledger/generic-steps/connect-device/connect-ledger-start';
import { RetrieveTaprootToNativeSegwit } from '@app/features/retrieve-taproot-to-native-segwit/retrieve-taproot-to-native-segwit';
import { BitcoinContractList } from '@app/pages/bitcoin-contract-list/bitcoin-contract-list';
import { BitcoinContractRequest } from '@app/pages/bitcoin-contract-request/bitcoin-contract-request';
import { ChooseAccount } from '@app/pages/choose-account/choose-account';
import { ChooseCryptoAssetToFund } from '@app/pages/fund/choose-asset-to-fund/choose-asset-to-fund';
import { FundPage } from '@app/pages/fund/fund';
import { Home } from '@app/pages/home/home';
import { BackUpSecretKeyPage } from '@app/pages/onboarding/back-up-secret-key/back-up-secret-key';
import { SignIn } from '@app/pages/onboarding/sign-in/sign-in';
import { WelcomePage } from '@app/pages/onboarding/welcome/welcome';
import { ReceiveBtcModal } from '@app/pages/receive/receive-btc';
import { ReceiveStxModal } from '@app/pages/receive/receive-stx';
import { RequestError } from '@app/pages/request-error/request-error';
import { RpcSignStacksTransaction } from '@app/pages/rpc-sign-stacks-transaction/rpc-sign-stacks-transaction';
import { BroadcastError } from '@app/pages/send/broadcast-error/broadcast-error';
import { LockBitcoinSummary } from '@app/pages/send/locked-bitcoin-summary/locked-bitcoin-summary';
import { sendOrdinalRoutes } from '@app/pages/send/ordinal-inscription/ordinal-routes';
import { sendCryptoAssetFormRoutes } from '@app/pages/send/send-crypto-asset-form/send-crypto-asset-form.routes';
import { alexSwapRoutes } from '@app/pages/swap/alex-swap-container';
import { UnauthorizedRequest } from '@app/pages/unauthorized-request/unauthorized-request';
import { Unlock } from '@app/pages/unlock';
import { ViewSecretKey } from '@app/pages/view-secret-key/view-secret-key';
import { AccountGate } from '@app/routes/account-gate';
import { receiveRoutes } from '@app/routes/receive-routes';
import { legacyRequestRoutes } from '@app/routes/request-routes';
import { rpcRequestRoutes } from '@app/routes/rpc-routes';

import { OnboardingGate } from './onboarding-gate';

export function SuspenseLoadingSpinner() {
  return <LoadingSpinner height="600px" />;
}

export function AppRoutes() {
  const routes = useAppRoutes();
  return <RouterProvider router={routes} />;
}

const sentryCreateBrowserRouter = Sentry.wrapCreateBrowserRouter(createHashRouter);

export const homePageModalRoutes = (
  <>
    {receiveRoutes}
    {ledgerStacksTxSigningRoutes}
    {ledgerBitcoinTxSigningRoutes}
    {requestBitcoinKeysRoutes}
    {requestStacksKeysRoutes}
    {sendOrdinalRoutes}
  </>
);

function useAppRoutes() {
  return sentryCreateBrowserRouter(
    createRoutesFromElements(
      <Route element={<Container />}>
        <Route key="error" errorElement={<RouterErrorBoundary />}>
          <Route
            path="/*"
            element={
              <AccountGate>
                <Home />
              </AccountGate>
            }
          >
            {homePageModalRoutes}
          </Route>

          <Route
            path={RouteUrls.RetrieveTaprootFunds}
            element={<RetrieveTaprootToNativeSegwit />}
          />
          <Route path={RouteUrls.IncreaseStxFee} element={<IncreaseStxFeeDialog />}>
            {ledgerStacksTxSigningRoutes}
          </Route>
          <Route
            path={`${RouteUrls.IncreaseStxFee}/${RouteUrls.TransactionBroadcastError}`}
            element={<BroadcastError />}
          />
          <Route path={RouteUrls.CancelStxTransaction} element={<CancelStxTransactionDialog />}>
            {ledgerStacksTxSigningRoutes}
          </Route>
          <Route
            path={`${RouteUrls.CancelStxTransaction}/${RouteUrls.TransactionBroadcastError}`}
            element={<BroadcastError />}
          />

          <Route path={RouteUrls.IncreaseBtcFee} element={<IncreaseBtcFeeDialog />}>
            {ledgerBitcoinTxSigningRoutes}
          </Route>

          {ledgerStacksTxSigningRoutes}

          <Route
            path={RouteUrls.RpcReceiveBitcoinContractOffer}
            element={
              <AccountGate>
                <Suspense fallback={<SuspenseLoadingSpinner />}>
                  <BitcoinContractRequest />
                </Suspense>
              </AccountGate>
            }
          />
          <Route path={RouteUrls.BitcoinContractLockSuccess} element={<LockBitcoinSummary />} />
          <Route path={RouteUrls.BitcoinContractLockError} element={<BroadcastError />} />
          <Route path={RouteUrls.BitcoinContractList} element={<BitcoinContractList />} />
          <Route
            path={RouteUrls.Onboarding}
            element={
              <OnboardingGate>
                <WelcomePage />
              </OnboardingGate>
            }
          >
            <Route path={RouteUrls.ConnectLedgerStart} element={<ConnectLedgerStart />} />
            <Route
              path={RouteUrls.LedgerUnsupportedBrowser}
              element={<UnsupportedBrowserLayout />}
            />

            {requestBitcoinKeysRoutes}
            {requestStacksKeysRoutes}
          </Route>
          <Route
            path={RouteUrls.BackUpSecretKey}
            element={
              <OnboardingGate>
                <BackUpSecretKeyPage />
              </OnboardingGate>
            }
          />
          <Route
            path={RouteUrls.SetPassword}
            lazy={async () => {
              const { SetPasswordRoute } = await import(
                '@app/pages/onboarding/set-password/set-password'
              );
              return { Component: SetPasswordRoute };
            }}
          />

          <Route
            path={RouteUrls.SignIn}
            element={
              <OnboardingGate>
                <SignIn />
              </OnboardingGate>
            }
          />
          <Route
            path={RouteUrls.AddNetwork}
            element={
              <AccountGate>
                <AddNetwork />
              </AccountGate>
            }
          />
          <Route
            path={RouteUrls.ChooseAccount}
            element={
              <AccountGate>
                <ChooseAccount />
              </AccountGate>
            }
          >
            {ledgerJwtSigningRoutes}
          </Route>

          <Route
            path={RouteUrls.Fund}
            element={
              <AccountGate>
                <FundPage />
              </AccountGate>
            }
          >
            <Route path={RouteUrls.ReceiveStx} element={<ReceiveStxModal />} />
            <Route path={RouteUrls.ReceiveBtc} element={<ReceiveBtcModal />} />
          </Route>
          <Route
            path={RouteUrls.FundChooseCurrency}
            element={
              <AccountGate>
                <ChooseCryptoAssetToFund />
              </AccountGate>
            }
          >
            <Route path={RouteUrls.ReceiveStx} element={<ReceiveStxModal />} />
          </Route>

          {sendCryptoAssetFormRoutes}

          <Route
            path={RouteUrls.ViewSecretKey}
            element={
              <AccountGate>
                <ViewSecretKey />
              </AccountGate>
            }
          />
          <Route path={RouteUrls.Unlock} element={<Unlock />}>
            {leatherIntroDialogRoutes}
          </Route>

          {legacyRequestRoutes}
          {rpcRequestRoutes}
          <Route path={RouteUrls.UnauthorizedRequest} element={<UnauthorizedRequest />} />
          <Route
            path={RouteUrls.RequestError}
            element={
              <AccountGate>
                <RequestError />
              </AccountGate>
            }
          />

          <Route
            path={RouteUrls.RpcSignStacksTransaction}
            element={
              <AccountGate>
                <RpcSignStacksTransaction />
              </AccountGate>
            }
          >
            <Route path={RouteUrls.EditNonce} element={<EditNonceDialog />} />
          </Route>

          <Route
            path={RouteUrls.RpcSignBip322Message}
            lazy={async () => {
              const { RpcSignBip322MessageRoute } = await import(
                '@app/pages/rpc-sign-bip322-message/rpc-sign-bip322-message'
              );
              return { Component: RpcSignBip322MessageRoute };
            }}
          >
            {ledgerBitcoinTxSigningRoutes}
          </Route>

          {alexSwapRoutes}

          {/* Catch-all route redirects to onboarding */}
          <Route path="*" element={<Navigate replace to={RouteUrls.Onboarding} />} />
        </Route>
      </Route>
    )
  );
}
