import { Route } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';

import { AccountGate } from '@app/routes/account-gate';

import { Swap } from './swap';
import { SwapChooseAsset } from './swap-choose-asset/swap-choose-asset';
import { SwapContainer } from './swap-container';
import { SwapError } from './swap-error/swap-error';
import { SwapReview } from './swap-review/swap-review';

export const swapRoutes = (
  <Route
    element={
      <AccountGate>
        <SwapContainer />
      </AccountGate>
    }
  >
    <Route path={RouteUrls.Swap} element={<Swap />}>
      <Route path={RouteUrls.SwapChooseAsset} element={<SwapChooseAsset />} />
    </Route>
    <Route path={RouteUrls.SwapError} element={<SwapError />} />
    <Route path={RouteUrls.SwapReview} element={<SwapReview />} />
  </Route>
);
