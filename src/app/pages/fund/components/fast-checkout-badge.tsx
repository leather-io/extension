import { FiZap } from 'react-icons/fi';

import { HStack, styled } from 'leather-styles/jsx';

export function FastCheckoutBadge() {
  {
    /* #4476 FIXME update icon and colours */
  }
  return (
    <HStack
      alignItems="center"
      border="1px solid"
      borderColor="#D9EDD4"
      borderRadius="xxl"
      height="24px"
      justifyContent="center"
      paddingX="space.02"
      paddingY="space.01"
      gap="space.01"
    >
      <FiZap color="#008051" size="12px" strokeWidth="2.5px" />
      <styled.span color="#008051" textStyle="caption.02">
        Fast checkout
      </styled.span>
    </HStack>
  );
}
