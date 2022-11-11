import { Suspense } from 'react';
import { Route } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';

import { FullPageWithHeaderLoadingSpinner } from '@app/components/loading-spinner';
import { AccountGate } from '@app/routes/account-gate';

import { SendCryptoAssetForm } from '../send-crypto-asset/send-crypto-asset-form/send-crypto-asset-form';
import { SendCryptoAsset } from './send-crypto-asset';

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
    />
    <Route path={RouteUrls.SendCryptoAssetForm} element={<SendCryptoAssetForm />} />
    <Route path={RouteUrls.SendCryptoAssetFormConfirmation} element={<>confirmation</>} />
  </>
);
