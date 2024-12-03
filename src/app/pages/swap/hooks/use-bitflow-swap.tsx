import { useState } from 'react';

import type { RouteQuote } from 'bitflow-sdk';

import type { SwapAsset } from '@leather.io/query';

import { logger } from '@shared/logger';
import { bitflow } from '@shared/utils/bitflow-sdk';

import { useCurrentStacksAccountAddress } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';

import { SwapSubmissionData } from '../swap.context';
import { useBitflowSwappableAssets } from './use-bitflow-swappable-assets';

export function useBitflowSwap() {
  const [swapSubmissionData, setSwapSubmissionData] = useState<SwapSubmissionData>();
  const [slippage, _setSlippage] = useState(0.04);
  const [isFetchingExchangeRate, setIsFetchingExchangeRate] = useState(false);
  const address = useCurrentStacksAccountAddress();
  const { data: bitflowSwapAssets = [] } = useBitflowSwappableAssets(address);

  async function fetchRouteQuote(
    base: SwapAsset,
    quote: SwapAsset,
    baseAmount: string
  ): Promise<RouteQuote | undefined> {
    if (!baseAmount || !base || !quote) return;
    try {
      const result = await bitflow.getQuoteForRoute(
        base.tokenId,
        quote.tokenId,
        Number(baseAmount)
      );
      if (!result.bestRoute) {
        logger.error('No swap route found');
        return;
      }
      return result.bestRoute;
    } catch (e) {
      logger.error('Error fetching exchange rate from Bitflow', e);
      return;
    }
  }

  async function fetchQuoteAmount(
    base: SwapAsset,
    quote: SwapAsset,
    baseAmount: string
  ): Promise<string | undefined> {
    if (base.name === 'BTC' || quote.name === 'sBTC') return baseAmount;
    setIsFetchingExchangeRate(true);
    const routeQuote = await fetchRouteQuote(base, quote, baseAmount);
    setIsFetchingExchangeRate(false);
    if (!routeQuote) return;
    return String(routeQuote.quote);
  }

  return {
    fetchRouteQuote,
    fetchQuoteAmount,
    isFetchingExchangeRate,
    onSetIsFetchingExchangeRate: (value: boolean) => setIsFetchingExchangeRate(value),
    onSetSwapSubmissionData: (value: SwapSubmissionData) => setSwapSubmissionData(value),
    slippage,
    bitflowSwapAssets,
    swapSubmissionData,
  };
}
