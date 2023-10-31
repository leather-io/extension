import { Flex } from '@stacks/ui';
import { HStack, styled } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

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
          <styled.span ml="space.02" mr="space.01" textStyle="body.01">
            {name}
          </styled.span>
          {symbol && <styled.span textStyle="body.01">({symbol.toUpperCase()})</styled.span>}
        </Flex>
      </HStack>
    </Flex>
  );
}
