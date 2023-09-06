import { Flex } from '@stacks/ui';
import { token } from 'leather-styles/tokens';

import { SpaceBetween } from '@app/components/layout/space-between';
import { Text } from '@app/components/typography';

interface CollectibleAssetProps {
  icon: React.JSX.Element;
  name: string;
  symbol?: string;
}
export function CollectibleAsset({ icon, name, symbol }: CollectibleAssetProps) {
  return (
    <Flex
      alignItems="center"
      border={`1px solid ${token('colors.accent.border-default')}`}
      borderRadius="10px"
      minHeight="64px"
      mb="base"
      mt="loose"
      px="base"
      width="100%"
    >
      <SpaceBetween>
        <Flex alignItems="center">
          {icon}
          <Text ml="tight" mr="extra-tight">
            {name}
          </Text>
          {symbol && <Text>({symbol.toUpperCase()})</Text>}
        </Flex>
      </SpaceBetween>
    </Flex>
  );
}
