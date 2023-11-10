import { FiStar } from 'react-icons/fi';

import { HStack, styled } from 'leather-styles/jsx';

export function ZeroPercentFeesBadge() {
  return (
    <HStack
      alignItems="center"
      border="1px solid"
      borderColor="#FFE0C2"
      borderRadius="24px"
      height="24px"
      justifyContent="center"
      paddingX="space.02"
      paddingY="space.01"
      gap="space.01"
    >
      {/* #4476 FIXME update icon and colours */}
      <FiStar color="#F59300" size="12px" strokeWidth="2.5px" />
      <styled.span color="#FFA953" textStyle="caption.02">
        0 % Fees
      </styled.span>
    </HStack>
  );
}
