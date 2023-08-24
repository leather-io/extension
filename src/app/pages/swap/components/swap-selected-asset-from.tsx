import { useField, useFormikContext } from 'formik';

import { isUndefined } from '@shared/utils';

import { useShowFieldError } from '@app/common/form-utils';
import { formatMoneyWithoutSymbol } from '@app/common/money/format-money';

import { useAmountAsFiat } from '../hooks/use-amount-as-fiat';
import { SwapFormValues } from '../hooks/use-swap';
import { useSwapContext } from '../swap.context';
import { SwapAmountField } from './swap-amount-field';
import { SwapSelectedAssetLayout } from './swap-selected-asset.layout';

const sendingMaxCaption = 'Using max available';
const sendingMaxTooltip = 'When sending max, this amount is affected by the fee you choose.';

const maxAvailableCaption = 'Max available in your balance';
const maxAvailableTooltip =
  'Amount of funds that is immediately available for use, after taking into account any pending transactions or holds placed on your account by the protocol.';

interface SwapSelectedAssetFromProps {
  onChooseAsset(): void;
  title: string;
}
export function SwapSelectedAssetFrom({ onChooseAsset, title }: SwapSelectedAssetFromProps) {
  const { fetchToAmount } = useSwapContext();
  const { setFieldValue, validateForm, values } = useFormikContext<SwapFormValues>();
  const [amountField, amountFieldMeta, amountFieldHelpers] = useField('swapAmountFrom');
  const showError = useShowFieldError('swapAmountFrom');
  const [assetField] = useField('swapAssetFrom');

  const amountAsFiat = useAmountAsFiat(amountField.value, assetField.value.balance);

  const formattedBalance = formatMoneyWithoutSymbol(assetField.value.balance);

  async function onSetMaxBalanceAsAmountToSwap() {
    amountFieldHelpers.setValue(formattedBalance);
    const { swapAssetFrom, swapAssetTo } = values;
    if (swapAssetTo != null && swapAssetFrom != null) {
      const toAmount = await fetchToAmount(swapAssetFrom, swapAssetTo, formattedBalance);
      await setFieldValue('swapAmountTo', toAmount);
      await validateForm();
    }
  }

  const isSendingMax = formattedBalance === values.swapAmountFrom;

  return (
    <SwapSelectedAssetLayout
      caption={isSendingMax ? sendingMaxCaption : maxAvailableCaption}
      error={amountFieldMeta.error}
      icon={assetField.value.icon}
      name="swapAmountFrom"
      onChooseAsset={onChooseAsset}
      onClickHandler={onSetMaxBalanceAsAmountToSwap}
      showError={!!showError}
      swapAmountInput={
        <SwapAmountField
          amountAsFiat={amountAsFiat}
          isDisabled={isUndefined(values.swapAssetTo)}
          name="swapAmountFrom"
        />
      }
      symbol={assetField.value.balance.symbol}
      title={title}
      tooltipLabel={isSendingMax ? sendingMaxTooltip : maxAvailableTooltip}
      value={isSendingMax ? '' : formattedBalance}
    />
  );
}
