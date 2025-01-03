import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { useFormikContext } from 'formik';

import type { SwapFormValues } from '@shared/models/form.model';

import { type BaseSwapContext, useSwapContext } from '../swap.context';

export function useSwapRouteParams<T extends BaseSwapContext<T>>() {
  const { isCrossChainSwap, onSetIsCrossChainSwap, swappableAssetsBase, swappableAssetsQuote } =
    useSwapContext<T>();
  const { setFieldValue, validateForm } = useFormikContext<SwapFormValues>();
  const { origin, base, quote } = useParams();

  useEffect(() => {
    if (!isCrossChainSwap && origin === 'bitcoin') onSetIsCrossChainSwap(true);
    if (base)
      void setFieldValue(
        'swapAssetBase',
        swappableAssetsBase.find(asset => asset.name === base)
      );
    if (quote)
      void setFieldValue(
        'swapAssetQuote',
        swappableAssetsQuote.find(asset => asset.name === quote)
      );
    void validateForm();
  }, [
    base,
    isCrossChainSwap,
    onSetIsCrossChainSwap,
    origin,
    quote,
    setFieldValue,
    swappableAssetsBase,
    swappableAssetsQuote,
    validateForm,
  ]);
}
