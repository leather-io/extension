import { Flex, HStack, styled } from 'leather-styles/jsx';

interface CollectibleAssetProps {
  icon: React.JSX.Element;
  name: string;
  symbol?: string;
}
export function CollectibleAsset({ icon, name, symbol }: CollectibleAssetProps) {
  return (
    <Flex
      alignItems="center"
      border="default"
      borderRadius="sm"
      minHeight="64px"
      mb="space.04"
      mt="space.05"
      px="space.04"
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
