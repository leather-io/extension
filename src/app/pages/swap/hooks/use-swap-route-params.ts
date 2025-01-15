import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { useFormikContext } from 'formik';

import type { SwapFormValues } from '@shared/models/form.model';

import { type BaseSwapContext, useSwapContext } from '../swap.context';

export function useSwapRouteParams<T extends BaseSwapContext<T>>() {
  const { isCrossChainSwap, onSetIsCrossChainSwap, swapData } = useSwapContext<T>();
  const { setFieldValue, validateForm } = useFormikContext<SwapFormValues>();
  const { base, quote } = useParams();

  useEffect(() => {
    if (!isCrossChainSwap && swapData.chain === 'bitcoin') onSetIsCrossChainSwap(true);
    if (base)
      void setFieldValue(
        'swapAssetBase',
        swapData.swappableAssetsBase.find(asset => asset.name === base)
      );
    if (quote)
      void setFieldValue(
        'swapAssetQuote',
        swapData.swappableAssetsQuote.find(asset => asset.name === quote)
      );
    void validateForm();
  }, [base, isCrossChainSwap, onSetIsCrossChainSwap, quote, setFieldValue, swapData, validateForm]);
}
