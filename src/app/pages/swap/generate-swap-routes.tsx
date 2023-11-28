import { Route } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';

import { ledgerStacksTxSigningRoutes } from '@app/features/ledger/flows/stacks-tx-signing/ledger-sign-stacks-tx-container';
import { AccountGate } from '@app/routes/account-gate';

import { Swap } from './swap';
import { SwapChooseAsset } from './swap-choose-asset/swap-choose-asset';
import { SwapError } from './swap-error/swap-error';
import { SwapReview } from './swap-review/swap-review';

export function generateSwapRoutes(container: React.ReactNode) {
  return (
    <Route element={<AccountGate>{container}</AccountGate>}>
      <Route path={RouteUrls.Swap} element={<Swap />}>
        <Route path={RouteUrls.SwapChooseAsset} element={<SwapChooseAsset />} />
      </Route>
      <Route path={RouteUrls.SwapError} element={<SwapError />} />
      <Route path={RouteUrls.SwapReview} element={<SwapReview />}>
        {ledgerStacksTxSigningRoutes}
      </Route>
    </Route>
  );
}
