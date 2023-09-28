import { Suspense } from 'react';
import {
  Navigate,
  Route,
  RouterProvider,
  createHashRouter,
  createRoutesFromElements,
} from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';

import { BroadcastErrorDrawer } from '@app/components/broadcast-error-drawer/broadcast-error-drawer';
import { LoadingSpinner } from '@app/components/loading-spinner';
import { ActivityList } from '@app/features/activity-list/activity-list';
import { AddNetwork } from '@app/features/add-network/add-network';
import { AssetsList } from '@app/features/asset-list/asset-list';
import { Container } from '@app/features/container/container';
import { EditNonceDrawer } from '@app/features/edit-nonce-drawer/edit-nonce-drawer';
import { IncreaseBtcFeeDrawer } from '@app/features/increase-fee-drawer/increase-btc-fee-drawer';
import { IncreaseFeeSentDrawer } from '@app/features/increase-fee-drawer/increase-fee-sent-drawer';
import { IncreaseStxFeeDrawer } from '@app/features/increase-fee-drawer/increase-stx-fee-drawer';
import { leatherIntroDialogRoutes } from '@app/features/leather-intro-dialog/leather-intro-dialog';
import { ledgerJwtSigningRoutes } from '@app/features/ledger/flows/jwt-signing/ledger-sign-jwt.routes';
import { requestBitcoinKeysRoutes } from '@app/features/ledger/flows/request-bitcoin-keys/ledger-request-bitcoin-keys';
import { requestStacksKeysRoutes } from '@app/features/ledger/flows/request-stacks-keys/ledger-request-stacks-keys';
import { ledgerStacksMessageSigningRoutes } from '@app/features/ledger/flows/stacks-message-signing/ledger-stacks-sign-msg.routes';
import { ledgerStacksTxSigningRoutes } from '@app/features/ledger/flows/stacks-tx-signing/ledger-sign-tx.routes';
import { RetrieveTaprootToNativeSegwit } from '@app/features/retrieve-taproot-to-native-segwit/retrieve-taproot-to-native-segwit';
import { ThemesDrawer } from '@app/features/theme-drawer/theme-drawer';
import { BitcoinContractRequest } from '@app/pages/bitcoin-contract-request/bitcoin-contract-request';
import { ChooseAccount } from '@app/pages/choose-account/choose-account';
import { FundPage } from '@app/pages/fund/fund';
import { Home } from '@app/pages/home/home';
import { AllowDiagnosticsModal } from '@app/pages/onboarding/allow-diagnostics/allow-diagnostics';
import { BackUpSecretKeyPage } from '@app/pages/onboarding/back-up-secret-key/back-up-secret-key';
import { SignIn } from '@app/pages/onboarding/sign-in/sign-in';
import { WelcomePage } from '@app/pages/onboarding/welcome/welcome';
import { PsbtRequest } from '@app/pages/psbt-request/psbt-request';
import { ReceiveBtcModal } from '@app/pages/receive/receive-btc';
import { ReceiveModal } from '@app/pages/receive/receive-modal';
import { ReceiveOrdinalModal } from '@app/pages/receive/receive-ordinal';
import { ReceiveStxModal } from '@app/pages/receive/receive-stx';
import { RequestError } from '@app/pages/request-error/request-error';
import { RpcGetAddresses } from '@app/pages/rpc-get-addresses/rpc-get-addresses';
import { rpcSendTransferRoutes } from '@app/pages/rpc-send-transfer/rpc-send-transfer.routes';
import { RpcSignPsbt } from '@app/pages/rpc-sign-psbt/rpc-sign-psbt';
import { RpcSignPsbtSummary } from '@app/pages/rpc-sign-psbt/rpc-sign-psbt-summary';
import { SelectNetwork } from '@app/pages/select-network/select-network';
import { BroadcastError } from '@app/pages/send/broadcast-error/broadcast-error';
import { LockBitcoinSummary } from '@app/pages/send/locked-bitcoin-summary/locked-bitcoin-summary';
import { SendInscriptionContainer } from '@app/pages/send/ordinal-inscription/components/send-inscription-container';
import { SendInscriptionChooseFee } from '@app/pages/send/ordinal-inscription/send-inscription-choose-fee';
import { SendInscriptionForm } from '@app/pages/send/ordinal-inscription/send-inscription-form';
import { SendInscriptionReview } from '@app/pages/send/ordinal-inscription/send-inscription-review';
import { SendInscriptionSummary } from '@app/pages/send/ordinal-inscription/sent-inscription-summary';
import { sendCryptoAssetFormRoutes } from '@app/pages/send/send-crypto-asset-form/send-crypto-asset-form.routes';
import { SignOutConfirmDrawer } from '@app/pages/sign-out-confirm/sign-out-confirm';
import { StacksMessageSigningRequest } from '@app/pages/stacks-message-signing-request/stacks-message-signing-request';
import { swapRoutes } from '@app/pages/swap/swap.routes';
import { TransactionRequest } from '@app/pages/transaction-request/transaction-request';
import { UnauthorizedRequest } from '@app/pages/unauthorized-request/unauthorized-request';
import { Unlock } from '@app/pages/unlock';
import { ProfileUpdateRequest } from '@app/pages/update-profile-request/update-profile-request';
import { ViewSecretKey } from '@app/pages/view-secret-key/view-secret-key';
import { AccountGate } from '@app/routes/account-gate';

import { OnboardingGate } from './onboarding-gate';

function SuspenseLoadingSpinner() {
  return <LoadingSpinner height="600px" />;
}

export function AppRoutes() {
  const routes = useAppRoutes();
  return <RouterProvider router={routes} />;
}

function useAppRoutes() {
  const settingsModalRoutes = (
    <Route>
      <Route path={RouteUrls.SignOutConfirm} element={<SignOutConfirmDrawer />} />
      <Route path={RouteUrls.ChangeTheme} element={<ThemesDrawer />} />
      <Route path={RouteUrls.SelectNetwork} element={<SelectNetwork />} />
    </Route>
  );

  const legacyRequestRoutes = (
    <>
      <Route
        path={RouteUrls.TransactionRequest}
        element={
          <AccountGate>
            <Suspense fallback={<SuspenseLoadingSpinner />}>
              <TransactionRequest />
            </Suspense>
          </AccountGate>
        }
      >
        {ledgerStacksTxSigningRoutes}
        <Route path={RouteUrls.EditNonce} element={<EditNonceDrawer />} />
        <Route path={RouteUrls.TransactionBroadcastError} element={<BroadcastErrorDrawer />} />
      </Route>
      <Route
        path={RouteUrls.SignatureRequest}
        element={
          <AccountGate>
            <Suspense fallback={<SuspenseLoadingSpinner />}>
              <StacksMessageSigningRequest />
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

  const rpcRequestRoutes = (
    <>
      <Route
        path={RouteUrls.RpcGetAddresses}
        element={
          <AccountGate>
            <RpcGetAddresses />
          </AccountGate>
        }
      />
      {rpcSendTransferRoutes}
      <Route
        path={RouteUrls.RpcSignBip322Message}
        lazy={async () => {
          const { RpcSignBip322MessageRoute } = await import(
            '@app/pages/rpc-sign-bip322-message/rpc-sign-bip322-message'
          );
          return { Component: RpcSignBip322MessageRoute };
        }}
      />
      <Route
        path={RouteUrls.RpcSignPsbt}
        element={
          <AccountGate>
            <RpcSignPsbt />
          </AccountGate>
        }
      />
      <Route
        path={RouteUrls.RpcSignPsbtSummary}
        element={
          <AccountGate>
            <RpcSignPsbtSummary />
          </AccountGate>
        }
      />
    </>
  );

  return createHashRouter(
    createRoutesFromElements(
      <Route element={<Container />}>
        <Route
          path={RouteUrls.Home}
          element={
            <AccountGate>
              <Home />
            </AccountGate>
          }
        >
          <Route index element={<AssetsList />} />
          <Route path={RouteUrls.Activity} element={<ActivityList />} />

          {leatherIntroDialogRoutes}

          {requestBitcoinKeysRoutes}
          {requestStacksKeysRoutes}
          <Route path={RouteUrls.RetriveTaprootFunds} element={<RetrieveTaprootToNativeSegwit />} />

          <Route path={RouteUrls.IncreaseStxFee} element={<IncreaseStxFeeDrawer />}>
            {ledgerStacksTxSigningRoutes}
          </Route>
          <Route path={RouteUrls.IncreaseBtcFee} element={<IncreaseBtcFeeDrawer />} />
          <Route path={RouteUrls.IncreaseFeeSent} element={<IncreaseFeeSentDrawer />} />

          <Route path={RouteUrls.Receive} element={<ReceiveModal />} />
          <Route
            path={RouteUrls.ReceiveCollectible}
            element={<ReceiveModal type="collectible" />}
          />
          <Route path={RouteUrls.ReceiveCollectibleOrdinal} element={<ReceiveOrdinalModal />} />
          <Route path={RouteUrls.ReceiveStx} element={<ReceiveStxModal />} />
          <Route path={RouteUrls.ReceiveBtc} element={<ReceiveBtcModal />} />
          <Route path={RouteUrls.ReceiveBtcStamp} element={<ReceiveBtcModal type="btc-stamp" />} />

          <Route path={RouteUrls.SendOrdinalInscription} element={<SendInscriptionContainer />}>
            <Route index element={<SendInscriptionForm />} />
            <Route
              path={RouteUrls.SendOrdinalInscriptionChooseFee}
              element={<SendInscriptionChooseFee />}
            />
            <Route
              path={RouteUrls.SendOrdinalInscriptionReview}
              element={<SendInscriptionReview />}
            />
            <Route
              path={RouteUrls.SendOrdinalInscriptionSent}
              element={<SendInscriptionSummary />}
            />
            <Route path={RouteUrls.SendOrdinalInscriptionError} element={<BroadcastError />} />
          </Route>

          {settingsModalRoutes}
          {ledgerStacksTxSigningRoutes}
        </Route>
        <Route
          path={RouteUrls.RpcReceiveBitcoinContractOffer}
          element={
            <AccountGate>
              <Suspense fallback={<SuspenseLoadingSpinner />}>
                <BitcoinContractRequest />
              </Suspense>
            </AccountGate>
          }
        ></Route>
        <Route path={RouteUrls.BitcoinContractLockSuccess} element={<LockBitcoinSummary />} />
        <Route path={RouteUrls.BitcoinContractLockError} element={<BroadcastError />} />
        <Route
          path={RouteUrls.Onboarding}
          element={
            <OnboardingGate>
              <WelcomePage />
            </OnboardingGate>
          }
        >
          <Route path={RouteUrls.RequestDiagnostics} element={<AllowDiagnosticsModal />} />

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
          <Route path={RouteUrls.FundReceive} element={<ReceiveModal />} />
          <Route path={RouteUrls.FundReceiveStx} element={<ReceiveStxModal />} />
          <Route path={RouteUrls.FundReceiveBtc} element={<ReceiveBtcModal />} />
          {settingsModalRoutes}
        </Route>

        {sendCryptoAssetFormRoutes}

        <Route
          path={RouteUrls.ViewSecretKey}
          element={
            <AccountGate>
              <ViewSecretKey />
            </AccountGate>
          }
        >
          {settingsModalRoutes}
        </Route>
        <Route path={RouteUrls.Unlock} element={<Unlock />}>
          {settingsModalRoutes}
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
          path={RouteUrls.RpcSignBip322Message}
          lazy={async () => {
            const { RpcSignBip322MessageRoute } = await import(
              '@app/pages/rpc-sign-bip322-message/rpc-sign-bip322-message'
            );
            return { Component: RpcSignBip322MessageRoute };
          }}
        />

        {swapRoutes}

        {/* Catch-all route redirects to onboarding */}
        <Route path="*" element={<Navigate replace to={RouteUrls.Onboarding} />} />
      </Route>
    )
  );
}
