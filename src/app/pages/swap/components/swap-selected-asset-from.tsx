import { useField, useFormikContext } from 'formik';

import { isUndefined } from '@shared/utils';

import { useShowFieldError } from '@app/common/form-utils';
import { formatMoneyWithoutSymbol } from '@app/common/money/format-money';

import { useAmountAsFiat } from '../hooks/use-fiat-price';
import { SwapFormValues } from '../hooks/use-swap-form';
import { useSwapContext } from '../swap.context';
import { SwapAmountField } from './swap-amount-field';
import { SwapSelectedAssetLayout } from './swap-selected-asset.layout';

const availableBalanceCaption = 'Available balance';
const maxAvailableTooltip =
  'Amount of funds that is immediately available for use, after taking into account any pending transactions or holds placed on your account by the protocol.';
const sendingMaxTooltip = 'When sending max, this amount is affected by the fee you choose.';
interface SwapSelectedAssetFromProps {
  onChooseAsset(): void;
  title: string;
}
export function SwapSelectedAssetFrom({ onChooseAsset, title }: SwapSelectedAssetFromProps) {
  const { fetchToAmount, isSendingMax, onSetIsSendingMax } = useSwapContext();
  const { setFieldValue, setFieldError, values } = useFormikContext<SwapFormValues>();
  const [amountField, amountFieldMeta, amountFieldHelpers] = useField('swapAmountFrom');
  const showError = useShowFieldError('swapAmountFrom');
  const [assetField] = useField('swapAssetFrom');

  const amountAsFiat = useAmountAsFiat(
    assetField.value.balance,
    assetField.value.price,
    amountField.value
  );
  const formattedBalance = formatMoneyWithoutSymbol(assetField.value.balance);
  const isSwapAssetFromBalanceGreaterThanZero =
    values.swapAssetFrom?.balance.amount.isGreaterThan(0);

  async function onSetMaxBalanceAsAmountToSwap() {
    const { swapAssetFrom, swapAssetTo } = values;
    if (isUndefined(swapAssetFrom)) return;
    onSetIsSendingMax(!isSendingMax);
    await amountFieldHelpers.setValue(Number(formattedBalance));
    await amountFieldHelpers.setTouched(true);
    if (isUndefined(swapAssetTo)) return;
    const toAmount = await fetchToAmount(swapAssetFrom, swapAssetTo, formattedBalance);
    await setFieldValue('swapAmountTo', Number(toAmount));
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
      symbol={assetField.value.balance.symbol}
      title={title}
      tooltipLabel={isSendingMax ? sendingMaxTooltip : maxAvailableTooltip}
      value={formattedBalance}
    />
  );
}
