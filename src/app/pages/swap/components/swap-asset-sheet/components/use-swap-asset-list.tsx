import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router';

import BigNumber from 'bignumber.js';
import { useFormikContext } from 'formik';

import {
  convertAmountToFractionalUnit,
  createMoney,
  formatMoneyWithoutSymbol,
  isUndefined,
} from '@leather.io/utils';

import type { SwapFormValues } from '@shared/models/form.model';
import { RouteUrls } from '@shared/route-urls';

import { useBitflowValidPairs } from '@app/pages/swap/hooks/use-bitflow-valid-pairs';
import { type BaseSwapContext, useSwapContext } from '@app/pages/swap/swap.context';
import { constructSwapRoute } from '@app/pages/swap/swap.routes';
import type { SwapAsset } from '@app/query/common/alex-sdk/alex-sdk.hooks';

import type { SwapAssetListProps } from './swap-asset-list';

export function useSwapAssetList<T extends BaseSwapContext<T>>({
  assets,
  type,
}: SwapAssetListProps) {
  const { setFieldError, setFieldValue, values } = useFormikContext<SwapFormValues>();
  const { onSetIsFetchingExchangeRate, onSetIsCrossChainSwap, swapData } = useSwapContext<T>();
  const { fetchQuoteAmount } = swapData;
  const navigate = useNavigate();
  const { base, quote } = useParams();

  const isBaseList = type === 'base';
  const isQuoteList = type === 'quote';

  // Initialize valid pairs hook with enabled flag based on asset availability
  const {
    filterValidAssets,
    isLoading: isValidPairsLoading,
    isError: isValidPairsError,
  } = useBitflowValidPairs(assets, {
    enabled: assets.length > 0,
  });

  // Filter out selected asset and apply valid pairs filtering
  const selectableAssets = (() => {
    // First, filter out the currently selected asset
    const assetsWithoutSelected = assets.filter(
      asset =>
        (isBaseList && asset.name !== values.swapAssetQuote?.name) ||
        (isQuoteList && asset.name !== values.swapAssetBase?.name)
    );

    // Then apply valid pairs filtering
    if (isBaseList && values.swapAssetQuote?.tokenId) {
      // When selecting base asset, filter by assets that can be paired with the selected quote
      return filterValidAssets(assetsWithoutSelected, values.swapAssetQuote.tokenId, 'base');
    }

    if (isQuoteList && values.swapAssetBase?.tokenId) {
      // When selecting quote asset, filter by assets that can be paired with the selected base
      return filterValidAssets(assetsWithoutSelected, values.swapAssetBase.tokenId, 'quote');
    }

    // If no base or quote is selected, return all assets (minus the selected one)
    return assetsWithoutSelected;
  })();

  const onSelectBaseAsset = useCallback(
    (baseAsset: SwapAsset) => {
      void setFieldValue('swapAssetBase', baseAsset);
      // Handle bridge assets
      if (baseAsset.name === 'BTC') {
        onSetIsCrossChainSwap(true);
        return navigate(
          constructSwapRoute({
            chain: 'bitcoin',
            route: RouteUrls.Swap,
            params: {
              base: baseAsset.name,
              quote: 'sBTC',
            },
          })
        );
      }
      // Handle swap assets
      onSetIsCrossChainSwap(false);
      void navigate(
        constructSwapRoute({
          chain: 'stacks',
          route: RouteUrls.Swap,
          params: {
            base: baseAsset.name,
            quote: quote ?? '',
          },
        })
      );
    },
    [navigate, onSetIsCrossChainSwap, quote, setFieldValue]
  );

  const onSelectQuoteAsset = useCallback(
    (quoteAsset: SwapAsset, baseAsset?: SwapAsset) => {
      void setFieldValue('swapAssetQuote', quoteAsset);
      setFieldError('swapAssetQuote', undefined);
      // Handle bridge assets
      if (baseAsset?.name === 'BTC') {
        onSetIsCrossChainSwap(true);
        return navigate(
          constructSwapRoute({
            chain: 'bitcoin',
            route: RouteUrls.Swap,
            params: {
              base: baseAsset.name,
              quote: quoteAsset.name,
            },
          })
        );
      }
      // Handle swap assets
      onSetIsCrossChainSwap(false);
      void navigate(
        constructSwapRoute({
          chain: 'stacks',
          route: RouteUrls.Swap,
          params: {
            base: base ?? '',
            quote: quoteAsset.name,
          },
        })
      );
    },
    [base, navigate, onSetIsCrossChainSwap, setFieldError, setFieldValue]
  );

  const onFetchQuoteAmount = useCallback(
    async (baseAsset: SwapAsset, quoteAsset: SwapAsset) => {
      onSetIsFetchingExchangeRate(true);
      const quoteAmount = await fetchQuoteAmount(baseAsset, quoteAsset, values.swapAmountBase);
      onSetIsFetchingExchangeRate(false);
      // Handle race condition; make sure quote amount is 1:1
      if (baseAsset.name === 'BTC') {
        void setFieldValue('swapAmountQuote', values.swapAmountBase);
        return;
      }
      if (isUndefined(quoteAmount)) {
        void setFieldValue('swapAmountQuote', '');
        return;
      }
      const quoteAmountAsMoney = createMoney(
        convertAmountToFractionalUnit(new BigNumber(quoteAmount), quoteAsset?.balance.decimals),
        quoteAsset?.balance.symbol ?? '',
        quoteAsset?.balance.decimals
      );
      void setFieldValue('swapAmountQuote', formatMoneyWithoutSymbol(quoteAmountAsMoney));
      setFieldError('swapAmountQuote', undefined);
    },
    [
      fetchQuoteAmount,
      onSetIsFetchingExchangeRate,
      setFieldError,
      setFieldValue,
      values.swapAmountBase,
    ]
  );

  return {
    selectableAssets,
    isValidPairsLoading,
    isValidPairsError,
    async onSelectAsset(asset: SwapAsset) {
      let baseAsset: SwapAsset | undefined;
      let quoteAsset: SwapAsset | undefined;
      if (isBaseList) {
        baseAsset = asset;
        quoteAsset = values.swapAssetQuote;
        void onSelectBaseAsset(baseAsset);
      }
      if (isQuoteList) {
        baseAsset = values.swapAssetBase;
        quoteAsset = asset;
        void onSelectQuoteAsset(quoteAsset, baseAsset);
      }
      if (baseAsset && quoteAsset && values.swapAmountBase) {
        await onFetchQuoteAmount(baseAsset, quoteAsset);
      }
    },
  };
}
