import BigNumber from 'bignumber.js';
import type { RouteQuote } from 'bitflow-sdk';
import { P } from 'pino';

import { BtcFeeType, FeeTypes } from '@leather.io/models';
import { type SwapAsset, defaultSwapFee } from '@leather.io/query';
import { capitalize, isDefined, microStxToStx } from '@leather.io/utils';

import type { SwapFormValues } from './hooks/use-swap-form';
import type { SwapSubmissionData } from './swap.context';

export function estimateLiquidityFee(dexPath: string[]) {
  return new BigNumber(dexPath.length).times(0.3).toNumber();
}

export function formatDexPathItem(dex: string) {
  const name = dex.split('_')[0];
  return name === 'ALEX' ? name : capitalize(name.toLowerCase());
}

interface GetSwapSubmissionDataArgs {
  bitflowSwapAssets: SwapAsset[];
  routeQuote: RouteQuote;
  slippage: number;
  values: SwapFormValues;
}
export function getSwapSubmissionData({
  bitflowSwapAssets,
  routeQuote,
  slippage,
  values,
}: GetSwapSubmissionDataArgs): SwapSubmissionData {
  return {
    fee: microStxToStx(defaultSwapFee.amount).toNumber(),
    feeCurrency: 'STX',
    feeType: FeeTypes[FeeTypes.Middle],
    liquidityFee: estimateLiquidityFee(routeQuote.route.dex_path),
    nonce: values.nonce,
    protocol: 'Bitflow',
    dexPath: routeQuote.route.dex_path.map(formatDexPathItem),
    router: routeQuote.route.token_path
      .map(x => bitflowSwapAssets.find(asset => asset.tokenId === x))
      .filter(isDefined),
    slippage,
    swapAmountBase: values.swapAmountBase,
    swapAmountQuote: values.swapAmountQuote,
    swapAssetBase: values.swapAssetBase,
    swapAssetQuote: values.swapAssetQuote,
    timestamp: new Date().toISOString(),
  };
}

export function getCrossChainSwapSubmissionData(values: SwapFormValues): SwapSubmissionData {
  return {
    fee: 0,
    feeCurrency: 'BTC',
    feeType: BtcFeeType.Standard,
    liquidityFee: 0,
    protocol: 'sBTC',
    dexPath: [],
    router: [values.swapAssetBase, values.swapAssetQuote].filter(isDefined),
    slippage: 0,
    swapAmountBase: values.swapAmountBase,
    swapAmountQuote: values.swapAmountQuote,
    swapAssetBase: values.swapAssetBase,
    swapAssetQuote: values.swapAssetQuote,
    timestamp: new Date().toISOString(),
  };
}
