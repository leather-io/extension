import { FiChevronDown } from 'react-icons/fi';

import { Box, Stack, Text } from '@stacks/ui';
import { useField } from 'formik';

import { formatMoneyWithoutSymbol } from '@app/common/money/format-money';
import { SelectedAssetField } from '@app/components/forms/selected-asset-field';
import { Flag } from '@app/components/layout/flag';
import { SpaceBetween } from '@app/components/layout/space-between';

import { useAmountAsFiat } from '../hooks/use-amount-as-fiat';
import { SwapAmountField } from './swap-amount-field';
import { SwapSelectedAssetLayout } from './swap-selected-asset.layout';

interface SwapSelectedAssetToProps {
  onChooseAsset(): void;
  title: string;
}
export function SwapSelectedAssetTo({ onChooseAsset, title }: SwapSelectedAssetToProps) {
  const [amountField] = useField('swapAmountTo');
  const [assetField] = useField('swapAssetTo');

  const amountAsFiat = useAmountAsFiat(assetField.value.balance, amountField.value);

  return (
    <SwapSelectedAssetLayout
      caption="You have"
      title={title}
      value={formatMoneyWithoutSymbol(assetField.value.balance)}
    >
      <SelectedAssetField height="76px" mb="tight" name="swapAssetTo">
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
            <SwapAmountField amountAsFiat={amountAsFiat} isDisabled name="swapAmountTo" />
          </SpaceBetween>
        </Flag>
      </SelectedAssetField>
    </SwapSelectedAssetLayout>
  );
}
