import { FiChevronDown } from 'react-icons/fi';

import { Stack, Text } from '@stacks/ui';

import { SelectedAssetField } from '@app/components/forms/selected-asset-field';
import { Flag } from '@app/components/layout/flag';
import { SpaceBetween } from '@app/components/layout/space-between';

import { SwapAmountField } from './swap-amount-field';
import { SwapSelectedAssetLayout } from './swap-selected-asset.layout';

interface SwapSelectedAssetPlaceholderProps {
  onChooseAsset(): void;
  title: string;
}
export function SwapSelectedAssetPlaceholder({
  onChooseAsset,
  title,
}: SwapSelectedAssetPlaceholderProps) {
  return (
    <SwapSelectedAssetLayout title={title} value="0">
      <SelectedAssetField height="76px" mb="tight" name="swapAssetFrom">
        <Flag align="middle" img={<></>} spacing="tight">
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
              <Text>Select asset</Text>
              <FiChevronDown />
            </Stack>
            <SwapAmountField amountAsFiat="" isDisabled name="swapAmountFrom" />
          </SpaceBetween>
        </Flag>
      </SelectedAssetField>
    </SwapSelectedAssetLayout>
  );
}
