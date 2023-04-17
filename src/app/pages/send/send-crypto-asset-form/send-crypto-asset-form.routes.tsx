import { Suspense } from 'react';
import { Route } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';

import { BroadcastErrorDrawer } from '@app/components/broadcast-error-drawer/broadcast-error-drawer';
import { FullPageWithHeaderLoadingSpinner } from '@app/components/loading-spinner';
import { EditNonceDrawer } from '@app/features/edit-nonce-drawer/edit-nonce-drawer';
import { ledgerTxSigningRoutes } from '@app/features/ledger/flows/tx-signing/ledger-sign-tx.routes';
import { AccountGate } from '@app/routes/account-gate';

import { BroadcastError } from '../broadcast-error/broadcast-error';
import { ChooseCryptoAsset } from '../choose-crypto-asset/choose-crypto-asset';
import { SendBtcDisabled } from '../choose-crypto-asset/components/send-btc-disabled';
import { SendContainer } from '../send-container';
import { BtcSentSummary } from '../sent-summary/btc-sent-summary';
import { StxSentSummary } from '../sent-summary/stx-sent-summary';
import { RecipientAccountsDrawer } from './components/recipient-accounts-drawer/recipient-accounts-drawer';
import { BtcChooseFee } from './form/btc/btc-choose-fee';
import { BtcSendForm } from './form/btc/btc-send-form';
import { BtcSendFormConfirmation } from './form/btc/btc-send-form-confirmation';
import { Sip10TokenSendForm } from './form/stacks-sip10/sip10-token-send-form';
import { StacksSendFormConfirmation } from './form/stacks/stacks-send-form-confirmation';
import { StxSendForm } from './form/stx/stx-send-form';

const recipientAccountsDrawerRoute = (
  <Route
    path={RouteUrls.SendCryptoAssetFormRecipientAccounts}
    element={<RecipientAccountsDrawer />}
  />
);

const editNonceDrawerRoute = <Route path={RouteUrls.EditNonce} element={<EditNonceDrawer />} />;
const broadcastErrorDrawerRoute = (
  <Route path={RouteUrls.TransactionBroadcastError} element={<BroadcastErrorDrawer />} />
);

export const sendCryptoAssetFormRoutes = (
  <Route element={<SendContainer />}>
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

    <Route path={RouteUrls.SendCryptoAssetForm.replace(':symbol', 'btc')} element={<BtcSendForm />}>
      {recipientAccountsDrawerRoute}
    </Route>
    <Route path="/send/btc/confirm" element={<BtcSendFormConfirmation />} />
    <Route path="/send/btc/disabled" element={<SendBtcDisabled />} />
    <Route path="/send/btc/error" element={<BroadcastError />} />
    <Route path={RouteUrls.SendBtcChooseFee} element={<BtcChooseFee />}></Route>
    <Route path={RouteUrls.SendCryptoAssetForm.replace(':symbol', 'stx')} element={<StxSendForm />}>
      {broadcastErrorDrawerRoute}
      {editNonceDrawerRoute}
      {ledgerTxSigningRoutes}
      {recipientAccountsDrawerRoute}
    </Route>
    <Route path="/send/stx/confirm" element={<StacksSendFormConfirmation />} />

    <Route path={RouteUrls.SendSip10Form} element={<Sip10TokenSendForm />}>
      {broadcastErrorDrawerRoute}
      {editNonceDrawerRoute}
      {ledgerTxSigningRoutes}
      {recipientAccountsDrawerRoute}
    </Route>
    <Route path="/send/:symbol/:contractId/confirm" element={<StacksSendFormConfirmation />} />
    <Route path={RouteUrls.SentBtcTxSummary} element={<BtcSentSummary />}></Route>
    <Route path={RouteUrls.SentStxTxSummary} element={<StxSentSummary />}></Route>
  </Route>
);
