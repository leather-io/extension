import { memo } from 'react';

import { Stack, StackProps, Text } from '@stacks/ui';
import { useField } from 'formik';

import { useSelectedAssetBalance } from '@app/common/hooks/use-selected-asset-balance';
import { Caption } from '@app/components/typography';

import { SelectedAssetItem } from './selected-asset-item';

interface SelectedAssetProps extends StackProps {
  hideArrow?: boolean;
  onClearSearch(): void;
}
export const SelectedAsset = memo(({ hideArrow, onClearSearch, ...rest }: SelectedAssetProps) => {
  const [field] = useField('assetId');
  const { balanceFormatted: balance } = useSelectedAssetBalance(field.value);

  return (
    <Stack spacing="base-loose" flexDirection="column" {...rest}>
      <Stack spacing="tight">
        <Text display="block" fontSize={1} fontWeight="500" mb="tight">
          Choose an asset
        </Text>
        <SelectedAssetItem hideArrow={hideArrow} onClearSearch={onClearSearch} />
      </Stack>
      {balance && <Caption>Balance: {balance}</Caption>}
    </Stack>
  );
});
