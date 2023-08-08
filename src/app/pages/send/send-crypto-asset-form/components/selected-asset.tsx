import { Text } from '@stacks/ui';

import { SelectedAssetField } from '@app/components/forms/selected-asset-field';
import { Flag } from '@app/components/layout/flag';
import { SpaceBetween } from '@app/components/layout/space-between';

interface SelectedAssetProps {
  icon: React.JSX.Element;
  name: string;
  symbol: string;
}
export function SelectedAsset({ icon, name, symbol }: SelectedAssetProps) {
  return (
    <SelectedAssetField mb="base" name="symbol">
      <Flag img={icon} align="middle" spacing="tight">
        <SpaceBetween>
          <Text>
            {name} ({symbol.toUpperCase()})
          </Text>
        </SpaceBetween>
      </Flag>
    </SelectedAssetField>
  );
}
