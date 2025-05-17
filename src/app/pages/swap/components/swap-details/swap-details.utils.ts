import type { RouteQuote } from '@bitflowlabs/core-sdk';
import BigNumber from 'bignumber.js';

import { capitalize, isDefined } from '@leather.io/utils';

import type { SwapAsset } from '@app/query/common/alex-sdk/alex-sdk.hooks';

function estimateLiquidityFee(dexPath: string[]) {
  return new BigNumber(dexPath.length).times(0.3).toNumber();
}

function formatDexPathItem(dex: string) {
  const name = dex.split('_')[0];
  return name === 'ALEX' ? name : capitalize(name.toLowerCase());
}

interface getStacksSwapDataArgs {
  swapAssets: SwapAsset[];
  routeQuote: RouteQuote;
}
export function getStacksSwapDataFromRouteQuote({ routeQuote, swapAssets }: getStacksSwapDataArgs) {
  return {
    liquidityFee: estimateLiquidityFee(routeQuote.route.dex_path),
    dexPath: routeQuote.route.dex_path.map(formatDexPathItem),
    router: routeQuote.route.token_path
      .map(x => swapAssets.find(asset => asset.tokenId === x))
      .filter(isDefined),
  };
}
