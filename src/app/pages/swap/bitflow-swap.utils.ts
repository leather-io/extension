import BigNumber from 'bignumber.js';
import type { RouteQuote } from 'bitflow-sdk';

import { BtcFeeType, FeeTypes } from '@leather.io/models';
import { type SwapAsset, defaultSwapFee } from '@leather.io/query';
import { capitalize, isDefined, microStxToStx } from '@leather.io/utils';

import type { SwapFormValues } from '@shared/models/form.model';

import type { SwapSubmissionData } from './swap.context';

function estimateLiquidityFee(dexPath: string[]) {
  return new BigNumber(dexPath.length).times(0.3).toNumber();
}

function formatDexPathItem(dex: string) {
  const name = dex.split('_')[0];
  return name === 'ALEX' ? name : capitalize(name.toLowerCase());
}

interface getStacksSwapSubmissionDataArgs {
  bitflowSwapAssets: SwapAsset[];
  isEligibleForSponsor: boolean;
  routeQuote: RouteQuote;
  slippage: number;
  values: SwapFormValues;
}
export function getStacksSwapSubmissionData({
  bitflowSwapAssets,
  isEligibleForSponsor,
  routeQuote,
  slippage,
  values,
}: getStacksSwapSubmissionDataArgs): SwapSubmissionData {
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
    sponsored: isEligibleForSponsor,
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
    protocol: 'Bitcoin L2 Labs',
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
