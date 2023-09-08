import { Flex, styled } from 'leather-styles/jsx';

import { SpaceBetween } from '@app/components/layout/space-between';

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
      mb="space.04"
      mt="space.05"
      px="space.04"
      width="100%"
    >
      <SpaceBetween>
        <Flex alignItems="center">
          {icon}
          <styled.span ml="space.02" mr="space.01">
            {name}
          </styled.span>
          {symbol && <styled.span>({symbol.toUpperCase()})</styled.span>}
        </Flex>
      </SpaceBetween>
    </Flex>
  );
}
