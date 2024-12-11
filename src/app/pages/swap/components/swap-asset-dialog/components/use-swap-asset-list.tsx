import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import BigNumber from 'bignumber.js';
import { useFormikContext } from 'formik';

import type { SwapAsset } from '@leather.io/query';
import {
  convertAmountToFractionalUnit,
  createMoney,
  formatMoneyWithoutSymbol,
  isUndefined,
} from '@leather.io/utils';

import type { SwapFormValues } from '@shared/models/form.model';
import { RouteUrls } from '@shared/route-urls';

import { useSwapContext } from '@app/pages/swap/swap.context';

import type { SwapAssetListProps } from './swap-asset-list';

export function useSwapAssetList({ assets, type }: SwapAssetListProps) {
  const { setFieldError, setFieldValue, values } = useFormikContext<SwapFormValues>();
  const { fetchQuoteAmount, onSetIsCrossChainSwap } = useSwapContext();
  const navigate = useNavigate();
  const { base, quote } = useParams();

  const isBaseList = type === 'base';
  const isQuoteList = type === 'quote';

  // Filter out selected asset from selectable assets
  const selectableAssets = assets
    .filter(
      asset =>
        (isBaseList && asset.name !== values.swapAssetQuote?.name) ||
        (isQuoteList && asset.name !== values.swapAssetBase?.name)
    )
    // Only show sBTC as quote option if BTC is selected as base
    .filter(
      asset =>
        isBaseList ||
        (isQuoteList && values.swapAssetBase?.name !== 'BTC') ||
        (isQuoteList && values.swapAssetBase?.name === 'BTC' && asset.name === 'sBTC')
    );

  const onSelectBaseAsset = useCallback(
    (baseAsset: SwapAsset) => {
      void setFieldValue('swapAssetBase', baseAsset);
      // Handle bridge assets
      if (baseAsset.name === 'BTC') {
        onSetIsCrossChainSwap(true);
        return navigate(RouteUrls.Swap.replace(':base', baseAsset.name).replace(':quote', 'sBTC'));
      }
      // Handle swap assets
      onSetIsCrossChainSwap(false);
      navigate(RouteUrls.Swap.replace(':base', baseAsset.name).replace(':quote', quote ?? ''));
    },
    [navigate, onSetIsCrossChainSwap, quote, setFieldValue]
  );

  const onSelectQuoteAsset = useCallback(
    (quoteAsset: SwapAsset) => {
      void setFieldValue('swapAssetQuote', quoteAsset);
      setFieldError('swapAssetQuote', undefined);
      navigate(RouteUrls.Swap.replace(':base', base ?? '').replace(':quote', quoteAsset.name));
    },
    [base, navigate, setFieldError, setFieldValue]
  );

  const onFetchQuoteAmount = useCallback(
    async (baseAsset: SwapAsset, quoteAsset: SwapAsset) => {
      const quoteAmount = await fetchQuoteAmount(baseAsset, quoteAsset, values.swapAmountBase);
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
    [fetchQuoteAmount, setFieldError, setFieldValue, values.swapAmountBase]
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
        onSelectQuoteAsset(quoteAsset);
      }
      if (baseAsset && quoteAsset && values.swapAmountBase) {
        await onFetchQuoteAmount(baseAsset, quoteAsset);
      }
    },
  };
}
