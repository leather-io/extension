import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useFormikContext } from 'formik';

import type { SwapFormValues } from '@shared/models/form.model';
import { RouteUrls } from '@shared/route-urls';

import { useSwapContext } from '../swap.context';

export function useSwapAssetsFromRoute() {
  const { swappableAssetsBase, swappableAssetsQuote } = useSwapContext();
  const { setFieldValue, values, validateForm } = useFormikContext<SwapFormValues>();
  const { base, quote } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Handle if same asset selected; reset assets
    // Should not happen bc of list filtering
    if (base === quote) {
      void setFieldValue('swapAssetQuote', undefined);
      void setFieldValue('swapAmountQuote', '');
      return navigate(RouteUrls.Swap.replace(':base', 'STX').replace(':quote', ''));
    }
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
    navigate,
    quote,
    setFieldValue,
    swappableAssetsBase,
    swappableAssetsQuote,
    validateForm,
    values.swapAssetBase,
  ]);
}
