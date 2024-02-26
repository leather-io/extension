import { HStack, styled } from 'leather-styles/jsx';

import { StarIcon } from '@app/ui/icons/star-icon';

export function ZeroPercentFeesBadge() {
  return (
    <HStack
      alignItems="center"
      border="default"
      borderRadius="xs"
      height="24px"
      justifyContent="center"
      paddingX="space.02"
      paddingY="space.01"
      gap="space.01"
    >
      <StarIcon color="yellow.action-primary-default" variant="small" />
      <styled.span color="yellow.action-primary-default" textStyle="caption.02">
        0 % Fees
      </styled.span>
    </HStack>
  );
}
