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
    // Debug token issues
    console.log('Swap route params:', { base, quote, chain: swapData.chain });
    console.log('Available base assets:', swapData.swappableAssetsBase.map(a => a.name));
    
    if (!isCrossChainSwap && swapData.chain === 'bitcoin') onSetIsCrossChainSwap(true);
    if (base) {
      // Enhanced asset matching with normalization and fallback options
      // First try exact match
      let baseAsset = swapData.swappableAssetsBase.find(asset => 
        asset.name === base
      );
      
      // If not found, try case-insensitive match
      if (!baseAsset) {
        baseAsset = swapData.swappableAssetsBase.find(asset => 
          asset.name.toLowerCase() === base.toLowerCase()
        );
      }
      
      // If still not found, try matching by symbol
      if (!baseAsset) {
        baseAsset = swapData.swappableAssetsBase.find(asset => 
          asset.name.toLowerCase().includes(base.toLowerCase()) || 
          (asset.fallback && asset.fallback.toLowerCase() === base.toLowerCase())
        );
      }
      
      if (!baseAsset) {
        console.error(`Base asset not found: ${base}`);
        console.log('Available assets:', swapData.swappableAssetsBase.map(a => ({ name: a.name, tokenId: a.tokenId })));
      } else {
        console.log('Found base asset:', baseAsset.name, baseAsset.tokenId);
      }
      
      void setFieldValue('swapAssetBase', baseAsset);
    }
    if (quote) {
      // Enhanced asset matching with normalization and fallback options
      // First try exact match
      let quoteAsset = swapData.swappableAssetsQuote.find(asset => 
        asset.name === quote
      );
      
      // If not found, try case-insensitive match
      if (!quoteAsset) {
        quoteAsset = swapData.swappableAssetsQuote.find(asset => 
          asset.name.toLowerCase() === quote.toLowerCase()
        );
      }
      
      // If still not found, try matching by symbol
      if (!quoteAsset) {
        quoteAsset = swapData.swappableAssetsQuote.find(asset => 
          asset.name.toLowerCase().includes(quote.toLowerCase()) || 
          (asset.fallback && asset.fallback.toLowerCase() === quote.toLowerCase())
        );
      }
      
      if (!quoteAsset) {
        console.error(`Quote asset not found: ${quote}`);
        console.log('Available quote assets:', swapData.swappableAssetsQuote.map(a => ({ name: a.name, tokenId: a.tokenId })));
      } else {
        console.log('Found quote asset:', quoteAsset.name, quoteAsset.tokenId);
      }
      
      void setFieldValue('swapAssetQuote', quoteAsset);
    }
    void validateForm();
  }, [base, isCrossChainSwap, onSetIsCrossChainSwap, quote, setFieldValue, swapData, validateForm]);
}
