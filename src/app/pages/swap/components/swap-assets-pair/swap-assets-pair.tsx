import { useNavigate } from 'react-router-dom';

import { useFormikContext } from 'formik';

import { isUndefined } from '@leather.io/utils';

import { RouteUrls } from '@shared/route-urls';

import { SwapFormValues } from '../../hooks/use-swap-form';
import { SwapAssetItemLayout } from './swap-asset-item.layout';
import { SwapAssetsPairLayout } from './swap-assets-pair.layout';

export function SwapAssetsPair() {
  const {
    values: { swapAmountBase, swapAmountQuote, swapAssetBase, swapAssetQuote },
  } = useFormikContext<SwapFormValues>();
  const navigate = useNavigate();

  if (isUndefined(swapAssetBase) || isUndefined(swapAssetQuote)) {
    navigate(RouteUrls.Swap, { replace: true });
    return null;
  }

  return (
    <SwapAssetsPairLayout
      swapAssetBase={
        <SwapAssetItemLayout
          caption="You will swap"
          icon={swapAssetBase.icon}
          symbol={swapAssetBase.name}
          value={swapAmountBase}
        />
      }
      swapAssetQuote={
        <SwapAssetItemLayout
          caption="You will receive"
          icon={swapAssetQuote.icon}
          symbol={swapAssetQuote.name}
          value={swapAmountQuote}
        />
      }
    />
  );
}
