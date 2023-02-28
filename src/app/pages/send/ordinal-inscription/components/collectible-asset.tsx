import { Flex } from '@stacks/ui';

import { SpaceBetween } from '@app/components/layout/space-between';
import { Text } from '@app/components/typography';

interface CollectibleAssetProps {
  icon: JSX.Element;
  name: string;
  symbol?: string;
}
export function CollectibleAsset({ icon, name, symbol }: CollectibleAssetProps) {
  return (
    <SpaceBetween py="base" px="base" width="100%">
      <Flex alignItems="center">
        {icon}
        <Text ml="tight" mr="extra-tight">
          {name}
        </Text>
        {symbol && <Text>({symbol.toUpperCase()})</Text>}
      </Flex>
    </SpaceBetween>
  );
}
