import { createMoney, isDefined, isUndefined } from '@leather-wallet/utils';
import BigNumber from 'bignumber.js';
import { useField, useFormikContext } from 'formik';

import { RouteUrls } from '@shared/route-urls';

import { useShowFieldError } from '@app/common/form-utils';
import { convertAmountToFractionalUnit } from '@app/common/money/calculate-money';
import { formatMoneyWithoutSymbol, i18nFormatCurrency } from '@app/common/money/format-money';

import { SwapFormValues } from '../../hooks/use-swap-form';
import { useSwapNavigate } from '../../hooks/use-swap-navigate';
import { useSwapContext } from '../../swap.context';
import { convertInputAmountValueToFiat } from '../../swap.utils';
import { SwapAmountField } from './components/swap-amount-field';
import { SwapAssetSelectLayout } from './components/swap-asset-select.layout';

const availableBalanceCaption = 'Available balance';
const maxAvailableTooltip =
  'Amount of funds that are immediately available for use, after taking into account any pending transactions or holds placed on your account by the protocol.';
const sendingMaxTooltip = 'When sending max, this amount is affected by the fee you choose.';

export function SwapAssetSelectBase() {
  const { fetchQuoteAmount, isFetchingExchangeRate, isSendingMax, onSetIsSendingMax } =
    useSwapContext();
  const { setFieldValue, setFieldError, values } = useFormikContext<SwapFormValues>();
  const [amountField, amountFieldMeta, amountFieldHelpers] = useField('swapAmountBase');
  const showError = useShowFieldError('swapAmountBase');
  const [assetField] = useField('swapAssetBase');
  const navigate = useSwapNavigate();

  const amountAsFiat =
    isDefined(assetField.value && amountField.value) &&
    convertInputAmountValueToFiat(
      assetField.value.balance,
      assetField.value.marketData,
      amountField.value
    );
  const formattedBalance = formatMoneyWithoutSymbol(assetField.value.balance);
  const isSwapAssetBaseBalanceGreaterThanZero =
    values.swapAssetBase?.balance.amount.isGreaterThan(0);

  async function onSetMaxBalanceAsAmountToSwap() {
    const { swapAssetBase, swapAssetQuote } = values;
    if (isFetchingExchangeRate || isUndefined(swapAssetBase)) return;
    onSetIsSendingMax(!isSendingMax);
    await amountFieldHelpers.setValue(Number(formattedBalance));
    await amountFieldHelpers.setTouched(true);
    if (isUndefined(swapAssetQuote)) return;
    const toAmount = await fetchQuoteAmount(swapAssetBase, swapAssetQuote, formattedBalance);
    if (isUndefined(toAmount)) {
      await setFieldValue('swapAmountQuote', '');
      return;
    }
    const toAmountAsMoney = createMoney(
      convertAmountToFractionalUnit(
        new BigNumber(toAmount),
        values.swapAssetQuote?.balance.decimals
      ),
      values.swapAssetQuote?.balance.symbol ?? '',
      values.swapAssetQuote?.balance.decimals
    );
    await setFieldValue('swapAmountQuote', formatMoneyWithoutSymbol(toAmountAsMoney));
    setFieldError('swapAmountQuote', undefined);
  }

  return (
    <SwapAssetSelectLayout
      caption={availableBalanceCaption}
      error={amountFieldMeta.error}
      icon={assetField.value.icon}
      name="swapAmountBase"
      onSelectAsset={() => navigate(RouteUrls.SwapAssetSelectBase)}
      onClickHandler={onSetMaxBalanceAsAmountToSwap}
      showError={!!(showError && values.swapAssetQuote)}
      swapAmountInput={
        <SwapAmountField
          amountAsFiat={amountAsFiat ? i18nFormatCurrency(amountAsFiat) : ''}
          isDisabled={!isSwapAssetBaseBalanceGreaterThanZero}
          name="swapAmountBase"
        />
      }
      symbol={assetField.value.name}
      title="You pay"
      tooltipLabel={isSendingMax ? sendingMaxTooltip : maxAvailableTooltip}
      value={formattedBalance}
    />
  );
}
