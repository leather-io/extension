import { Flex } from '@stacks/ui';
import { HStack } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

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
      <HStack alignItems="center" justifyContent="space-between">
        <Flex alignItems="center">
          {icon}
          <Text ml="tight" mr="extra-tight">
            {name}
          </Text>
          {symbol && <Text>({symbol.toUpperCase()})</Text>}
        </Flex>
      </HStack>
    </Flex>
  );
}
