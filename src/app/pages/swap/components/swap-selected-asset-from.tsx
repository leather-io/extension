import BigNumber from 'bignumber.js';
import { useField, useFormikContext } from 'formik';

import { createMoney } from '@shared/models/money.model';
import { isUndefined } from '@shared/utils';

import { useShowFieldError } from '@app/common/form-utils';
import { convertAmountToFractionalUnit } from '@app/common/money/calculate-money';
import { formatMoneyWithoutSymbol } from '@app/common/money/format-money';

import { useAlexSdkAmountAsFiat } from '../hooks/use-alex-sdk-fiat-price';
import { SwapFormValues } from '../hooks/use-swap-form';
import { useSwapContext } from '../swap.context';
import { SwapAmountField } from './swap-amount-field';
import { SwapSelectedAssetLayout } from './swap-selected-asset.layout';

const availableBalanceCaption = 'Available balance';
const maxAvailableTooltip =
  'Amount of funds that are immediately available for use, after taking into account any pending transactions or holds placed on your account by the protocol.';
const sendingMaxTooltip = 'When sending max, this amount is affected by the fee you choose.';
interface SwapSelectedAssetFromProps {
  onChooseAsset(): void;
  title: string;
}
export function SwapSelectedAssetFrom({ onChooseAsset, title }: SwapSelectedAssetFromProps) {
  const { fetchToAmount, isFetchingExchangeRate, isSendingMax, onSetIsSendingMax } =
    useSwapContext();
  const { setFieldValue, setFieldError, values } = useFormikContext<SwapFormValues>();
  const [amountField, amountFieldMeta, amountFieldHelpers] = useField('swapAmountFrom');
  const showError = useShowFieldError('swapAmountFrom');
  const [assetField] = useField('swapAssetFrom');

  const amountAsFiat = useAlexSdkAmountAsFiat(
    assetField.value.balance,
    assetField.value.price,
    amountField.value
  );
  const formattedBalance = formatMoneyWithoutSymbol(assetField.value.balance);
  const isSwapAssetFromBalanceGreaterThanZero =
    values.swapAssetFrom?.balance.amount.isGreaterThan(0);

  async function onSetMaxBalanceAsAmountToSwap() {
    const { swapAssetFrom, swapAssetTo } = values;
    if (isFetchingExchangeRate || isUndefined(swapAssetFrom)) return;
    onSetIsSendingMax(!isSendingMax);
    await amountFieldHelpers.setValue(Number(formattedBalance));
    await amountFieldHelpers.setTouched(true);
    if (isUndefined(swapAssetTo)) return;
    const toAmount = await fetchToAmount(swapAssetFrom, swapAssetTo, formattedBalance);
    if (isUndefined(toAmount)) {
      await setFieldValue('swapAmountTo', '');
      return;
    }
    const toAmountAsMoney = createMoney(
      convertAmountToFractionalUnit(new BigNumber(toAmount), values.swapAssetTo?.balance.decimals),
      values.swapAssetTo?.balance.symbol ?? '',
      values.swapAssetTo?.balance.decimals
    );
    await setFieldValue('swapAmountTo', formatMoneyWithoutSymbol(toAmountAsMoney));
    setFieldError('swapAmountTo', undefined);
  }

  return (
    <SwapSelectedAssetLayout
      caption={availableBalanceCaption}
      error={amountFieldMeta.error}
      icon={assetField.value.icon}
      name="swapAmountFrom"
      onChooseAsset={onChooseAsset}
      onClickHandler={onSetMaxBalanceAsAmountToSwap}
      showError={!!(showError && values.swapAssetTo)}
      swapAmountInput={
        <SwapAmountField
          amountAsFiat={amountAsFiat}
          isDisabled={!isSwapAssetFromBalanceGreaterThanZero}
          name="swapAmountFrom"
        />
      }
      symbol={assetField.value.name}
      title={title}
      tooltipLabel={isSendingMax ? sendingMaxTooltip : maxAvailableTooltip}
      value={formattedBalance}
    />
  );
}
