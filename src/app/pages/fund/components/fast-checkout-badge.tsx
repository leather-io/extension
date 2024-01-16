import { HStack, styled } from 'leather-styles/jsx';

import { ZapIcon } from '@app/ui/components/icons/zap-icon';

export function FastCheckoutBadge() {
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
      <ZapIcon color="success.label" size="xs" />
      <styled.span color="success.label" textStyle="caption.02">
        Fast checkout
      </styled.span>
    </HStack>
  );
}
