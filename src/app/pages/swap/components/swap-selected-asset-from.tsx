import { FiChevronDown } from 'react-icons/fi';

import { Box, Stack, Text } from '@stacks/ui';
import { useField, useFormikContext } from 'formik';

import { isUndefined } from '@shared/utils';

import { formatMoneyWithoutSymbol } from '@app/common/money/format-money';
import { SelectedAssetField } from '@app/components/forms/selected-asset-field';
import { Flag } from '@app/components/layout/flag';
import { SpaceBetween } from '@app/components/layout/space-between';

import { useAmountAsFiat } from '../hooks/use-amount-as-fiat';
import { SwapFormValues } from '../hooks/use-swap';
import { tempExchangeRate } from '../hooks/use-swappable-assets';
import { SwapAmountField } from './swap-amount-field';
import { SwapSelectedAssetLayout } from './swap-selected-asset.layout';

const sendingMaxCaption = 'Using max available';
const sendingMaxTooltip = 'When sending max, this amount is affected by the fee you choose.';

const maxAvailableCaption = 'Max available in your balance';
const maxAvailableTooltip =
  'Amount of funds that is immediately available for use, after taking into account any pending transactions or holds placed on your account by the protocol.';

const sendAnyValue = 'Send any value';

interface SwapSelectedAssetFromProps {
  isSendingMax: boolean;
  onChooseAsset(): void;
  onSetIsSendingMax(value: boolean): void;
  title: string;
}
export function SwapSelectedAssetFrom({
  isSendingMax,
  onChooseAsset,
  onSetIsSendingMax,
  title,
}: SwapSelectedAssetFromProps) {
  const { setFieldValue, validateForm, values } = useFormikContext<SwapFormValues>();
  const [amountField, _, amountFieldHelpers] = useField('swapAmountFrom');
  const [assetField] = useField('swapAssetFrom');

  const amountAsFiat = useAmountAsFiat(assetField.value.balance, amountField.value);

  const formattedBalance = formatMoneyWithoutSymbol(assetField.value.balance);

  async function onSetMaxBalanceAsAmountToSwap() {
    if (isUndefined(values.swapAssetTo)) return;
    onSetIsSendingMax(!isSendingMax);
    const value = isSendingMax ? '' : formattedBalance;
    amountFieldHelpers.setValue(value);
    // TODO: Need exchange rate here from asset
    await setFieldValue('swapAmountTo', Number(value) * tempExchangeRate);
    await validateForm();
  }

  return (
    <SwapSelectedAssetLayout
      caption={isSendingMax ? sendingMaxCaption : maxAvailableCaption}
      onClickHandler={onSetMaxBalanceAsAmountToSwap}
      title={title}
      tooltipLabel={isSendingMax ? sendingMaxTooltip : maxAvailableTooltip}
      value={isSendingMax ? sendAnyValue : formattedBalance}
    >
      <SelectedAssetField height="76px" mb="tight" name="swapAssetFrom">
        <Flag
          align="middle"
          img={<Box as="img" src={assetField.value.icon} width="24px" />}
          spacing="tight"
        >
          <SpaceBetween>
            <Stack
              alignItems="center"
              as="button"
              isInline
              onClick={onChooseAsset}
              spacing="tight"
              type="button"
              width="50%"
            >
              <Text>{assetField.value.balance.symbol}</Text>
              <FiChevronDown />
            </Stack>
            <SwapAmountField
              amountAsFiat={amountAsFiat}
              isDisabled={isUndefined(values.swapAssetTo)}
              name="swapAmountFrom"
            />
          </SpaceBetween>
        </Flag>
      </SelectedAssetField>
    </SwapSelectedAssetLayout>
  );
}
