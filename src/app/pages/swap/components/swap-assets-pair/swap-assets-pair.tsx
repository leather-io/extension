import { useNavigate } from 'react-router-dom';

import { useFormikContext } from 'formik';

import { createMoneyFromDecimal, formatMoneyWithoutSymbol, isUndefined } from '@leather.io/utils';

import type { SwapFormValues } from '@shared/models/form.model';
import { RouteUrls } from '@shared/route-urls';

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

  const formattedSwapAmountBase = formatMoneyWithoutSymbol(
    createMoneyFromDecimal(
      Number(swapAmountBase),
      swapAssetBase.name,
      swapAssetBase.balance.decimals
    )
  );

  return (
    <SwapAssetsPairLayout
      swapAssetBase={
        <SwapAssetItemLayout
          caption="You will swap"
          icon={swapAssetBase.icon}
          symbol={swapAssetBase.name}
          value={formattedSwapAmountBase}
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
