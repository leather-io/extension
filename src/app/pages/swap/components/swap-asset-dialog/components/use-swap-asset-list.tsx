import { useEffect, useState } from 'react';
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

import { RouteUrls } from '@shared/route-urls';

import type { SwapFormValues } from '@app/pages/swap/hooks/use-swap-form';
import { useSwapContext } from '@app/pages/swap/swap.context';

import type { SwapAssetListProps } from './swap-asset-list';

export function useSwapAssetList({ assets, type }: SwapAssetListProps) {
  const [selectableAssets, setSelectableAssets] = useState<SwapAsset[]>(assets);
  const { setFieldError, setFieldValue, values } = useFormikContext<SwapFormValues>();
  const { fetchQuoteAmount } = useSwapContext();
  const navigate = useNavigate();
  const { base, quote } = useParams();

  const isBaseList = type === 'base';
  const isQuoteList = type === 'quote';

  useEffect(() => {
    setSelectableAssets(
      assets.filter(
        asset =>
          (isBaseList && asset.name !== values.swapAssetQuote?.name) ||
          (isQuoteList && asset.name !== values.swapAssetBase?.name)
      )
    );
  }, [assets, isBaseList, isQuoteList, values.swapAssetBase?.name, values.swapAssetQuote?.name]);

  function onSelectBaseAsset(baseAsset: SwapAsset, quoteAsset?: SwapAsset) {
    void setFieldValue('swapAssetBase', baseAsset);
    // Handle bridge assets
    if (baseAsset.name === 'BTC')
      return navigate(RouteUrls.Swap.replace(':base', baseAsset.name).replace(':quote', 'sBTC'));
    if (quoteAsset?.name === 'sBTC') {
      void setFieldValue('swapAssetQuote', undefined);
      return navigate(RouteUrls.Swap.replace(':base', baseAsset.name).replace(':quote', ''));
    }
    // Handle swap assets
    navigate(RouteUrls.Swap.replace(':base', baseAsset.name).replace(':quote', quote ?? ''));
  }

  function onSelectQuoteAsset(quoteAsset: SwapAsset, baseAsset?: SwapAsset) {
    void setFieldValue('swapAssetQuote', quoteAsset);
    setFieldError('swapAssetQuote', undefined);
    // Handle bridge assets
    if (isQuoteList && quoteAsset.name === 'sBTC')
      return navigate(RouteUrls.Swap.replace(':base', 'BTC').replace(':quote', quoteAsset.name));
    if (isQuoteList && baseAsset?.name === 'BTC') {
      return navigate(RouteUrls.Swap.replace(':base', 'STX').replace(':quote', quoteAsset.name));
    }
    // Handle swap assets
    navigate(RouteUrls.Swap.replace(':base', base ?? '').replace(':quote', quoteAsset.name));
  }

  async function onFetchQuoteAmount(baseAsset: SwapAsset, quoteAsset: SwapAsset) {
    const quoteAmount = await fetchQuoteAmount(baseAsset, quoteAsset, values.swapAmountBase);
    if (isUndefined(quoteAmount)) {
      await setFieldValue('swapAmountQuote', '');
      return;
    }
    const quoteAmountAsMoney = createMoney(
      convertAmountToFractionalUnit(new BigNumber(quoteAmount), quoteAsset?.balance.decimals),
      quoteAsset?.balance.symbol ?? '',
      quoteAsset?.balance.decimals
    );
    await setFieldValue('swapAmountQuote', formatMoneyWithoutSymbol(quoteAmountAsMoney));
    setFieldError('swapAmountQuote', undefined);
  }

  return {
    selectableAssets,
    async onSelectAsset(asset: SwapAsset) {
      let baseAsset: SwapAsset | undefined;
      let quoteAsset: SwapAsset | undefined;
      if (isBaseList) {
        baseAsset = asset;
        quoteAsset = values.swapAssetQuote;
        onSelectBaseAsset(baseAsset, quoteAsset);
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
