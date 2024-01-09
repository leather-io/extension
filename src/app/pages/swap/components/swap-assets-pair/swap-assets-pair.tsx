import { useNavigate } from 'react-router-dom';

import { useFormikContext } from 'formik';

import { RouteUrls } from '@shared/route-urls';
import { isUndefined } from '@shared/utils';

import { SwapFormValues } from '../../hooks/use-swap-form';
import { SwapAssetItemLayout } from './swap-asset-item.layout';
import { SwapAssetsPairLayout } from './swap-assets-pair.layout';

export function SwapAssetsPair() {
  const { values } = useFormikContext<SwapFormValues>();
  const { swapAmountFrom, swapAmountTo, swapAssetFrom, swapAssetTo } = values;
  const navigate = useNavigate();

  if (isUndefined(swapAssetFrom) || isUndefined(swapAssetTo)) {
    navigate(RouteUrls.Swap, { replace: true });
    return null;
  }

  return (
    <SwapAssetsPairLayout
      swapAssetFrom={
        <SwapAssetItemLayout
          caption="You will swap"
          icon={swapAssetFrom.icon}
          symbol={swapAssetFrom.name}
          value={swapAmountFrom}
        />
      }
      swapAssetTo={
        <SwapAssetItemLayout
          caption="You will receive"
          icon={swapAssetTo.icon}
          symbol={swapAssetTo.name}
          value={swapAmountTo}
        />
      }
    />
  );
}
