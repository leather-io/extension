import { HStack, styled } from 'leather-styles/jsx';

import { ZapIcon } from '@app/ui/icons/zap-icon';

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
      <ZapIcon color="green.action-primary-default" variant="small" />
      <styled.span color="green.action-primary-default" textStyle="caption.02">
        Fast checkout
      </styled.span>
    </HStack>
  );
}
