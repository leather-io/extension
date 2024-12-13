import { useCallback, useMemo, useState } from 'react';

import type { RouteQuote } from 'bitflow-sdk';

import { type SwapAsset } from '@leather.io/query';
import { isDefined, migratePositiveAssetBalancesToTop } from '@leather.io/utils';

import { logger } from '@shared/logger';
import { bitflow } from '@shared/utils/bitflow-sdk';

import { useConfigSbtc } from '@app/query/common/remote-config/remote-config.query';
import { useCurrentStacksAccountAddress } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';

import { SwapSubmissionData } from '../swap.context';
import { useBtcSwapAsset, useSbtcSwapAsset } from './use-bitcoin-bridge-assets';
import { useBitflowSwappableAssets } from './use-bitflow-swappable-assets';

const bitflowSBtcTokenId = 'token-sbtc';

function getBitflowSwappableAssetsWithSbtcAtTop(assets: SwapAsset[]) {
  const bitflowSbtcAsset = assets.find(asset => asset.tokenId === bitflowSBtcTokenId);
  const bitflowAssetsWithSbtcRemoved = assets.filter(asset => asset.tokenId !== bitflowSBtcTokenId);
  return [
    bitflowSbtcAsset,
    ...migratePositiveAssetBalancesToTop(bitflowAssetsWithSbtcRemoved),
  ].filter(isDefined);
}

export function useBitflowSwap() {
  const [isCrossChainSwap, setIsCrossChainSwap] = useState(false);
  const [swapSubmissionData, setSwapSubmissionData] = useState<SwapSubmissionData>();
  const [slippage, _setSlippage] = useState(0.04);
  const [isFetchingExchangeRate, setIsFetchingExchangeRate] = useState(false);
  const address = useCurrentStacksAccountAddress();
  const { data: bitflowSwapAssets = [] } = useBitflowSwappableAssets(address);
  const { isSbtcEnabled, isSbtcSwapsEnabled } = useConfigSbtc();

  const createBtcAsset = useBtcSwapAsset();
  const btcAsset = createBtcAsset();
  // TODO: Remove once supported by Bitflow
  const createSbtcAsset = useSbtcSwapAsset();
  const sbtcAsset = createSbtcAsset();

  const swappableAssetsBase = useMemo(() => {
    if (!isSbtcEnabled) return migratePositiveAssetBalancesToTop(bitflowSwapAssets);
    if (isSbtcSwapsEnabled)
      return [btcAsset, ...getBitflowSwappableAssetsWithSbtcAtTop(bitflowSwapAssets)];
    return [btcAsset, sbtcAsset, ...migratePositiveAssetBalancesToTop(bitflowSwapAssets)];
  }, [bitflowSwapAssets, btcAsset, isSbtcEnabled, isSbtcSwapsEnabled, sbtcAsset]);

  const swappableAssetsQuote = useMemo(() => {
    if (!isSbtcEnabled) return bitflowSwapAssets;
    if (isSbtcSwapsEnabled) return getBitflowSwappableAssetsWithSbtcAtTop(bitflowSwapAssets);
    return [sbtcAsset, ...bitflowSwapAssets];
  }, [bitflowSwapAssets, isSbtcEnabled, isSbtcSwapsEnabled, sbtcAsset]);

  const fetchRouteQuote = useCallback(
    async (
      base: SwapAsset,
      quote: SwapAsset,
      baseAmount: string
    ): Promise<RouteQuote | undefined> => {
      if (!baseAmount || !base || !quote || isCrossChainSwap) return;
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
    },
    [isCrossChainSwap]
  );

  const fetchQuoteAmount = useCallback(
    async (base: SwapAsset, quote: SwapAsset, baseAmount: string): Promise<string | undefined> => {
      setIsFetchingExchangeRate(true);
      const routeQuote = await fetchRouteQuote(base, quote, baseAmount);
      setIsFetchingExchangeRate(false);
      if (isCrossChainSwap) return baseAmount; // 1:1 swap
      if (!routeQuote) return;
      return String(routeQuote.quote);
    },
    [fetchRouteQuote, isCrossChainSwap]
  );

  return {
    fetchRouteQuote,
    fetchQuoteAmount,
    isCrossChainSwap,
    isFetchingExchangeRate,
    onSetIsCrossChainSwap: (value: boolean) => setIsCrossChainSwap(value),
    onSetIsFetchingExchangeRate: (value: boolean) => setIsFetchingExchangeRate(value),
    onSetSwapSubmissionData: (value: SwapSubmissionData) => setSwapSubmissionData(value),
    slippage,
    bitflowSwapAssets,
    swappableAssetsBase,
    swappableAssetsQuote,
    swapSubmissionData,
  };
}
