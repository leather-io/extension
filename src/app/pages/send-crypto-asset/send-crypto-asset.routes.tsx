import { Suspense } from 'react';
import { Route } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';

import { BroadcastErrorDrawer } from '@app/components/broadcast-error-drawer/broadcast-error-drawer';
import { FullPageWithHeaderLoadingSpinner } from '@app/components/loading-spinner';
import { ledgerTxSigningRoutes } from '@app/features/ledger/flows/tx-signing/ledger-sign-tx.routes';
import { AccountGate } from '@app/routes/account-gate';

import { SendCryptoAsset } from './send-crypto-asset';
import { SendCryptoAssetForm } from './send-crypto-asset-form/send-crypto-asset-form';

export const sendCryptoAssetRoutes = (
  <>
    <Route
      path={RouteUrls.SendCryptoAsset}
      element={
        <AccountGate>
          <Suspense fallback={<FullPageWithHeaderLoadingSpinner />}>
            <SendCryptoAsset />
          </Suspense>
        </AccountGate>
      }
    >
      {ledgerTxSigningRoutes}
      <Route path={RouteUrls.TransactionBroadcastError} element={<BroadcastErrorDrawer />} />
    </Route>
    <Route path={RouteUrls.SendCryptoAssetForm} element={<SendCryptoAssetForm />} />
    <Route path={RouteUrls.SendCryptoAssetFormConfirmation} element={<></>} />
  </>
);
