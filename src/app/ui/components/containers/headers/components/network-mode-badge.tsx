import { Flex, styled } from 'leather-styles/jsx';

interface NetworkModeBadge {
  isTestnetChain: boolean;
  name: string;
}

export function NetworkModeBadge({ isTestnetChain, name }: NetworkModeBadge) {
  if (!isTestnetChain) return null;

  // TODO #4794: replace with design system tag
  return (
    <Flex
      alignItems="center"
      border="subdued"
      borderRadius="md"
      height="24px"
      px="space.03"
      position="relative"
      zIndex={999}
    >
      <styled.span color="ink.text-subdued" textStyle="label.03">
        {name}
      </styled.span>
    </Flex>
  );
}
