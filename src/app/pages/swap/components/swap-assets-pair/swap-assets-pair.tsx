import { useNavigate } from 'react-router-dom';

import { useFormikContext } from 'formik';

import { createMoneyFromDecimal, isUndefined } from '@leather.io/utils';

import type { SwapFormValues } from '@shared/models/form.model';
import { RouteUrls } from '@shared/route-urls';

import { constructSwapRoute } from '../../swap.routes';
import { SwapAssetItemLayout } from './swap-asset-item.layout';
import { SwapAssetsPairLayout } from './swap-assets-pair.layout';

export function SwapAssetsPair() {
  const {
    values: { swapAmountBase, swapAmountQuote, swapAssetBase, swapAssetQuote },
  } = useFormikContext<SwapFormValues>();
  const navigate = useNavigate();

  if (isUndefined(swapAssetBase) || isUndefined(swapAssetQuote)) {
    navigate(
      constructSwapRoute({
        chain: 'stacks',
        route: RouteUrls.Swap,
        params: {
          base: 'STX',
          quote: '',
        },
      }),
      { replace: true }
    );
    return null;
  }

  const swapAmountBaseAsMoney = createMoneyFromDecimal(
    Number(swapAmountBase),
    swapAssetBase.name,
    swapAssetBase.balance.decimals
  );
  const swapAmountQuoteAsMoney = createMoneyFromDecimal(
    Number(swapAmountQuote),
    swapAssetBase.name,
    swapAssetBase.balance.decimals
  );

  return (
    <SwapAssetsPairLayout
      swapAssetBase={
        <SwapAssetItemLayout
          caption="You will swap"
          icon={swapAssetBase.icon}
          symbol={swapAssetBase.name}
          value={swapAmountBaseAsMoney}
        />
      }
      swapAssetQuote={
        <SwapAssetItemLayout
          caption="You will receive"
          icon={swapAssetQuote.icon}
          symbol={swapAssetQuote.name}
          value={swapAmountQuoteAsMoney}
        />
      }
    />
  );
}
