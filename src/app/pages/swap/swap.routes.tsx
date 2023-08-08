import { Route } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';

import { AccountGate } from '@app/routes/account-gate';

import { SwapContainer } from './components/swap-container';
import { Swap } from './swap';
import { SwapChooseAsset } from './swap-choose-asset/swap-choose-asset';
import { SwapReview } from './swap-review/swap-review';
import { SwapSummary } from './swap-summary/swap-summary';

export const swapRoutes = (
  <Route element={<SwapContainer />}>
    <Route
      path={RouteUrls.Swap}
      element={
        <AccountGate>
          <Swap />
        </AccountGate>
      }
    >
      <Route path={RouteUrls.SwapChooseAsset} element={<SwapChooseAsset />} />
    </Route>
    <Route
      path={RouteUrls.SwapReview}
      element={
        <AccountGate>
          <SwapReview />
        </AccountGate>
      }
    />
    <Route
      path={RouteUrls.SwapSummary}
      element={
        <AccountGate>
          <SwapSummary />
        </AccountGate>
      }
    />
  </Route>
);
