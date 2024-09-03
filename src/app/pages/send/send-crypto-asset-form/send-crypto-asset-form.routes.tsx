import { Suspense } from 'react';
import { Route } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';

import { BroadcastErrorSheet } from '@app/components/broadcast-error-dialog/broadcast-error-dialog';
import { FullPageWithHeaderLoadingSpinner } from '@app/components/loading-spinner';
import { EditNonceSheet } from '@app/features/dialogs/edit-nonce-dialog/edit-nonce-dialog';
import { ledgerBitcoinTxSigningRoutes } from '@app/features/ledger/flows/bitcoin-tx-signing/ledger-bitcoin-sign-tx-container';
import { ledgerStacksTxSigningRoutes } from '@app/features/ledger/flows/stacks-tx-signing/ledger-sign-stacks-tx-container';
import { StacksHighFeeWarningContainer } from '@app/features/stacks-high-fee-warning/stacks-high-fee-warning-container';
import { SendBtcDisabled } from '@app/pages/send/choose-crypto-asset/send-btc-disabled';
import { AccountGate } from '@app/routes/account-gate';

import { BroadcastError } from '../broadcast-error/broadcast-error';
import { ChooseCryptoAsset } from '../choose-crypto-asset/choose-crypto-asset';
import { BtcSentSummary } from '../sent-summary/btc-sent-summary';
import { StxSentSummary } from '../sent-summary/stx-sent-summary';
import { RecipientAccountsSheet } from './components/recipient-accounts-dialog/recipient-accounts-dialog';
import { SendBitcoinAssetContainer } from './family/bitcoin/components/send-bitcoin-asset-container';
import { BtcChooseFee } from './form/btc/btc-choose-fee';
import { BtcSendForm } from './form/btc/btc-send-form';
import { BtcSendFormConfirmation } from './form/btc/btc-send-form-confirmation';
import { Sip10TokenSendForm } from './form/sip10/sip10-token-send-form';
import { StacksSendFormConfirmation } from './form/stacks/stacks-send-form-confirmation';
import { StxSendForm } from './form/stx/stx-send-form';

const recipientAccountsSheetRoute = (
  <Route
    path={RouteUrls.SendCryptoAssetFormRecipientAccounts}
    element={<RecipientAccountsSheet />}
  />
);

const editNonceSheetRoute = <Route path={RouteUrls.EditNonce} element={<EditNonceSheet />} />;
const broadcastErrorSheetRoute = (
  <Route path={'confirm/broadcast-error'} element={<BroadcastErrorSheet />} />
);

export const sendCryptoAssetFormRoutes = (
  <Route>
    <Route
      path={RouteUrls.SendCryptoAsset}
      element={
        <AccountGate>
          <Suspense fallback={<FullPageWithHeaderLoadingSpinner />}>
            <ChooseCryptoAsset />
          </Suspense>
        </AccountGate>
      }
    />

    <Route element={<SendBitcoinAssetContainer />}>
      <Route
        path={RouteUrls.SendCryptoAssetForm.replace(':symbol', 'btc')}
        element={<BtcSendForm />}
      >
        {ledgerBitcoinTxSigningRoutes}
        {recipientAccountsSheetRoute}
      </Route>
      <Route path={RouteUrls.SendBtcDisabled} element={<SendBtcDisabled />} />
      <Route path={RouteUrls.SendBtcError} element={<BroadcastError />} />

      <Route path={RouteUrls.SendBtcConfirmation} element={<BtcSendFormConfirmation />} />
      <Route path={RouteUrls.SendBtcChooseFee} element={<BtcChooseFee />}>
        {ledgerBitcoinTxSigningRoutes}
      </Route>
      <Route path={RouteUrls.SentBtcTxSummary} element={<BtcSentSummary />} />
    </Route>
    <Route
      path={RouteUrls.SendCryptoAssetForm.replace(':symbol', 'stx')}
      element={
        <StacksHighFeeWarningContainer>
          <StxSendForm />
        </StacksHighFeeWarningContainer>
      }
    >
      {broadcastErrorSheetRoute}
      {editNonceSheetRoute}
      {recipientAccountsSheetRoute}
    </Route>
    <Route
      path={`${RouteUrls.SendCryptoAssetForm.replace(':symbol', 'stx')}/confirm`}
      element={<StacksSendFormConfirmation />}
    >
      {ledgerStacksTxSigningRoutes}
    </Route>
    <Route
      path={RouteUrls.SendSip10Form}
      element={
        <StacksHighFeeWarningContainer>
          <Sip10TokenSendForm />
        </StacksHighFeeWarningContainer>
      }
    >
      {broadcastErrorSheetRoute}
      {editNonceSheetRoute}
      {recipientAccountsSheetRoute}
    </Route>
    <Route path="/send/:symbol/:contractId/confirm" element={<StacksSendFormConfirmation />}>
      {ledgerStacksTxSigningRoutes}
    </Route>
    <Route path={RouteUrls.SentStxTxSummary} element={<StxSentSummary />} />
  </Route>
);
