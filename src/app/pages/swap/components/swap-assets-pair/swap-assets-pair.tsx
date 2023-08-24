import { useFormikContext } from 'formik';

import { logger } from '@shared/logger';
import { isUndefined } from '@shared/utils';

import { SwapFormValues } from '../../hooks/use-swap';
import { SwapAssetItemLayout } from './swap-asset-item.layout';
import { SwapAssetsPairLayout } from './swap-assets-pair.layout';

export function SwapAssetsPair() {
  const { values } = useFormikContext<SwapFormValues>();
  const { swapAmountFrom, swapAmountTo, swapAssetFrom, swapAssetTo } = values;

  if (isUndefined(swapAssetFrom) || isUndefined(swapAssetTo)) {
    logger.error('No asset selected to swap');
    return null;
  }

  return (
    <SwapAssetsPairLayout
      swapAssetFrom={
        <SwapAssetItemLayout
          icon={swapAssetFrom.icon}
          symbol={swapAssetFrom.balance.symbol}
          value={swapAmountFrom}
        />
      }
      swapAssetTo={
        <SwapAssetItemLayout
          icon={swapAssetTo.icon}
          symbol={swapAssetTo.balance.symbol}
          value={swapAmountTo}
        />
      }
    />
  );
}
