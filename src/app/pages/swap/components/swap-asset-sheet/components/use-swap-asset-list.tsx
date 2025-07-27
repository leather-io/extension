import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router';

import BigNumber from 'bignumber.js';
import { useFormikContext } from 'formik';

import { convertAmountToFractionalUnit, createMoney, isUndefined } from '@leather.io/utils';

import type { SwapFormValues } from '@shared/models/form.model';
import { RouteUrls } from '@shared/route-urls';

import { formatCurrency } from '@app/common/currency-formatter';
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

  // Filter out selected asset from selectable assets
  const selectableAssets = assets.filter(
    asset =>
      (isBaseList && asset.name !== values.swapAssetQuote?.name) ||
      (isQuoteList && asset.name !== values.swapAssetBase?.name)
  );

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
      navigate(
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
      navigate(
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
      void setFieldValue(
        'swapAmountQuote',
        formatCurrency(quoteAmountAsMoney, {
          showCurrency: false,
          compactThreshold: Infinity,
          numberFormatOptions: { useGrouping: false },
        })
      );
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
    async onSelectAsset(asset: SwapAsset) {
      let baseAsset: SwapAsset | undefined;
      let quoteAsset: SwapAsset | undefined;
      if (isBaseList) {
        baseAsset = asset;
        quoteAsset = values.swapAssetQuote;
        onSelectBaseAsset(baseAsset);
      }
      if (isQuoteList) {
        baseAsset = values.swapAssetBase;
        quoteAsset = asset;
        onSelectQuoteAsset(quoteAsset, baseAsset);
      }
      if (baseAsset && quoteAsset && values.swapAmountBase) {
        await onFetchQuoteAmount(baseAsset, quoteAsset);
      }
    },
  };
}
