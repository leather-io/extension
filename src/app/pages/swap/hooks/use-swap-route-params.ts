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
    // Process route parameters for swap
    if (!isCrossChainSwap && swapData.chain === 'bitcoin') onSetIsCrossChainSwap(true);

    if (base) {
      // Enhanced asset matching with normalization and fallback options
      // First try exact match
      let baseAsset = swapData.swappableAssetsBase.find(asset => asset.name === base);

      // If not found, try case-insensitive match
      if (!baseAsset) {
        baseAsset = swapData.swappableAssetsBase.find(
          asset => asset.name.toLowerCase() === base.toLowerCase()
        );
      }

      // If still not found, try matching by token ID for tokens
      if (!baseAsset) {
        baseAsset = swapData.swappableAssetsBase.find(
          asset => asset.tokenId?.toLowerCase() === base.toLowerCase()
        );
      }

      void setFieldValue('swapAssetBase', baseAsset);
    }

    if (quote) {
      // Enhanced asset matching with normalization and fallback options
      // First try exact match
      let quoteAsset = swapData.swappableAssetsQuote.find(asset => asset.name === quote);

      // If not found, try case-insensitive match
      if (!quoteAsset) {
        quoteAsset = swapData.swappableAssetsQuote.find(
          asset => asset.name.toLowerCase() === quote.toLowerCase()
        );
      }

      // If still not found, try matching by token ID for tokens
      if (!quoteAsset) {
        quoteAsset = swapData.swappableAssetsQuote.find(
          asset => asset.tokenId?.toLowerCase() === quote.toLowerCase()
        );
      }

      void setFieldValue('swapAssetQuote', quoteAsset);
    }

    void validateForm();
  }, [base, isCrossChainSwap, onSetIsCrossChainSwap, quote, setFieldValue, swapData, validateForm]);
}
