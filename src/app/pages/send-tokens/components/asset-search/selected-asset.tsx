import { memo } from 'react';
import { useField } from 'formik';
import { Text, Stack, StackProps } from '@stacks/ui';

import { Caption } from '@app/components/typography';
import { useSelectedAssetBalance } from '@app/pages/send-tokens/hooks/use-selected-asset-balance';

import { SelectedAssetItem } from './selected-asset-item';

interface SelectedAssetProps extends StackProps {
  hideArrow?: boolean;
  onClearSearch(): void;
}
export const SelectedAsset = memo(({ hideArrow, onClearSearch, ...rest }: SelectedAssetProps) => {
  const [field] = useField('assetId');
  const { balance, ticker } = useSelectedAssetBalance(field.value);

  return (
    <Stack spacing="base-loose" flexDirection="column" {...rest}>
      <Stack spacing="tight">
        <Text display="block" fontSize={1} fontWeight="500" mb="tight">
          Choose an asset
        </Text>
        <SelectedAssetItem hideArrow={hideArrow} onClearSearch={onClearSearch} />
      </Stack>
      {balance && (
        <Caption>
          Balance: {balance} {ticker}
        </Caption>
      )}
    </Stack>
  );
});
