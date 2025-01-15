import { Route } from 'react-router-dom';

import type { Blockchain } from '@leather.io/models';

import { RouteUrls } from '@shared/route-urls';
import { replaceRouteParams } from '@shared/utils/replace-route-params';

import { ledgerBitcoinTxSigningRoutes } from '@app/features/ledger/flows/bitcoin-tx-signing/ledger-bitcoin-sign-tx-container';
import { ledgerStacksTxSigningRoutes } from '@app/features/ledger/flows/stacks-tx-signing/ledger-sign-stacks-tx-container';
import { AccountGate } from '@app/routes/account-gate';

import { SwapAssetSheetBase } from './components/swap-asset-sheet/swap-asset-sheet-base';
import { SwapAssetSheetQuote } from './components/swap-asset-sheet/swap-asset-sheet-quote';
import { SwapError } from './components/swap-error';
import { BitcoinSwapReview } from './components/swap-review/bitcoin-swap-review';
import { StacksSwapReview } from './components/swap-review/stacks-swap-review';
import { BitcoinSwapContainer } from './containers/bitcoin-swap-container';
import { StacksSwapContainer } from './containers/stacks-swap-container';
import { Swap } from './swap';

interface ConstructSwapRouteArgs {
  chain: Blockchain;
  route: string;
  params?: Record<string, string>;
}
export function constructSwapRoute({ chain, route, params }: ConstructSwapRouteArgs) {
  const baseRoute = route.replace('{chain}', `${chain}`);
  if (!params) return baseRoute;
  return replaceRouteParams(baseRoute, params);
}

export const bitcoinSwapRoutes = generateSwapRoutes({
  chain: 'bitcoin',
  container: <BitcoinSwapContainer />,
  review: <BitcoinSwapReview />,
});
export const stacksSwapRoutes = generateSwapRoutes({
  chain: 'stacks',
  container: <StacksSwapContainer />,
  review: <StacksSwapReview />,
});

interface GenerateSwapRoutesArgs {
  chain: Blockchain;
  container: React.ReactNode;
  review: React.ReactNode;
}
function generateSwapRoutes({ chain, container, review }: GenerateSwapRoutesArgs) {
  return (
    <Route element={<AccountGate>{container}</AccountGate>}>
      <Route path={constructSwapRoute({ chain, route: RouteUrls.Swap })} element={<Swap />}>
        <Route path={RouteUrls.SwapAssetSelectBase} element={<SwapAssetSheetBase />} />
        <Route path={RouteUrls.SwapAssetSelectQuote} element={<SwapAssetSheetQuote />} />
      </Route>
      <Route path={RouteUrls.SwapError} element={<SwapError />} />
      <Route path={constructSwapRoute({ chain, route: RouteUrls.SwapReview })} element={review}>
        {ledgerBitcoinTxSigningRoutes}
        {ledgerStacksTxSigningRoutes}
      </Route>
    </Route>
  );
}
