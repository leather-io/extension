import { Route } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';

import { AccountGate } from '@app/routes/account-gate';

import { SwapChooseAsset } from './swap-choose-asset/swap-choose-asset';
import { SwapContainer } from './swap-container';
import { SwapReview } from './swap-review/swap-review';
import { SwapSummary } from './swap-summary/swap-summary';
import { Swap } from './swap/swap';

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
    <Route path={RouteUrls.SwapReview} element={<SwapReview />} />
    <Route path={RouteUrls.SwapSummary} element={<SwapSummary />} />
  </Route>
);
