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
import { SendContainer } from '../send-container';
import { RecipientAccountsDrawer } from './components/recipient-accounts-drawer/recipient-accounts-drawer';
import { BtcSendForm } from './form/btc/btc-send-form';
import { BtcSendFormConfirmation } from './form/btc/btc-send-form-confirmation';
import { StacksSip10FungibleTokenSendForm } from './form/stacks-sip10/stacks-sip10-fungible-token-send-form';
import { StacksSip10SendFormConfirmation } from './form/stacks-sip10/stacks-sip10-send-form-confirmation';
import { StxSendForm } from './form/stx/stx-send-form';
import { StxSendFormConfirmation } from './form/stx/stx-send-form-confirmation';

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
    <Route path="/send/btc/error" element={<BroadcastError />} />

    <Route path={RouteUrls.SendCryptoAssetForm.replace(':symbol', 'stx')} element={<StxSendForm />}>
      {broadcastErrorDrawerRoute}
      {editNonceDrawerRoute}
      {ledgerTxSigningRoutes}
      {recipientAccountsDrawerRoute}
    </Route>
    <Route path="/send/stx/confirm" element={<StxSendFormConfirmation />} />

    <Route path={RouteUrls.SendCryptoAssetForm} element={<StacksSip10FungibleTokenSendForm />}>
      {broadcastErrorDrawerRoute}
      {editNonceDrawerRoute}
      {ledgerTxSigningRoutes}
      {recipientAccountsDrawerRoute}
    </Route>
    <Route path="/send/:symbol/confirm" element={<StacksSip10SendFormConfirmation />} />
  </Route>
);
