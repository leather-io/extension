import { useNavigate, useParams } from 'react-router-dom';

import { SwapSelectors } from '@tests/selectors/swap.selectors';
import BigNumber from 'bignumber.js';
import { useFormikContext } from 'formik';
import { Stack } from 'leather-styles/jsx';

import { createMoney } from '@shared/models/money.model';
import { RouteUrls } from '@shared/route-urls';
import { isUndefined } from '@shared/utils';

import { convertAmountToFractionalUnit } from '@app/common/money/calculate-money';
import { formatMoneyWithoutSymbol } from '@app/common/money/format-money';
import { useSwapContext } from '@app/pages/swap/swap.context';

import { SwapAsset, SwapFormValues } from '../../../hooks/use-swap-form';
import { SwapAssetItem } from './swap-asset-item';

interface SwapAssetList {
  assets: SwapAsset[];
  type: string;
}
export function SwapAssetList({ assets, type }: SwapAssetList) {
  const { fetchToAmount } = useSwapContext();
  const { setFieldError, setFieldValue, values } = useFormikContext<SwapFormValues>();
  const navigate = useNavigate();
  const { base, quote } = useParams();
  const isBaseList = type === 'base';
  const isQuoteList = type === 'quote';

  const selectableAssets = assets.filter(
    asset =>
      (isBaseList && asset.name !== values.swapAssetQuote?.name) ||
      (isQuoteList && asset.name !== values.swapAssetBase?.name)
  );

  async function onSelectAsset(asset: SwapAsset) {
    let from: SwapAsset | undefined;
    let to: SwapAsset | undefined;
    if (isBaseList) {
      from = asset;
      to = values.swapAssetQuote;
      await setFieldValue('swapAssetBase', asset);
      navigate(RouteUrls.Swap.replace(':base', from.name).replace(':quote', quote ?? ''));
    } else if (isQuoteList) {
      from = values.swapAssetBase;
      to = asset;
      await setFieldValue('swapAssetQuote', asset);
      setFieldError('swapAssetQuote', undefined);
      navigate(RouteUrls.Swap.replace(':base', base ?? '').replace(':quote', to.name));
    }

    if (from && to && values.swapAmountBase) {
      const toAmount = await fetchToAmount(from, to, values.swapAmountBase);
      if (isUndefined(toAmount)) {
        await setFieldValue('swapAmountQuote', '');
        return;
      }
      const toAmountAsMoney = createMoney(
        convertAmountToFractionalUnit(new BigNumber(toAmount), to?.balance.decimals),
        to?.balance.symbol ?? '',
        to?.balance.decimals
      );
      await setFieldValue('swapAmountQuote', formatMoneyWithoutSymbol(toAmountAsMoney));
      setFieldError('swapAmountQuote', undefined);
    }
  }

  return (
    <Stack mb="space.05" p="space.05" width="100%" data-testid={SwapSelectors.SwapAssetList}>
      {selectableAssets.map(asset => (
        <SwapAssetItem
          asset={asset}
          key={asset.balance.symbol}
          onClick={() => onSelectAsset(asset)}
        />
      ))}
    </Stack>
  );
}
