import { Route } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';

import { ledgerBitcoinTxSigningRoutes } from '@app/features/ledger/flows/bitcoin-tx-signing/ledger-bitcoin-sign-tx-container';
import { ledgerStacksTxSigningRoutes } from '@app/features/ledger/flows/stacks-tx-signing/ledger-sign-stacks-tx-container';
import { AccountGate } from '@app/routes/account-gate';

import { SwapAssetSheetBase } from './components/swap-asset-sheet/swap-asset-sheet-base';
import { SwapAssetSheetQuote } from './components/swap-asset-sheet/swap-asset-sheet-quote';
import { SwapError } from './components/swap-error';
import { SwapReview } from './components/swap-review/swap-review';
import { Swap } from './swap';

export function generateSwapRoutes(path: string, container: React.ReactNode) {
  return (
    <Route element={<AccountGate>{container}</AccountGate>}>
      {/* 
        Maybe this is confusing code beacuse we're statically replacing the `:origin`. 
        Should probs make it not look like a dynamic route, calling a .replace('{origin}') so it's clear it's
        a kind of templating.
      */}
      <Route path={RouteUrls.Swap.replace(':origin', path)} element={<Swap />}>
        <Route path={RouteUrls.SwapAssetSelectBase} element={<SwapAssetSheetBase />} />
        <Route path={RouteUrls.SwapAssetSelectQuote} element={<SwapAssetSheetQuote />} />
      </Route>
      <Route path={RouteUrls.SwapError} element={<SwapError />} />
      <Route path={RouteUrls.SwapReview} element={<SwapReview />}>
        {ledgerBitcoinTxSigningRoutes}
        {ledgerStacksTxSigningRoutes}
      </Route>
    </Route>
  );
}
