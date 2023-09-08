import { forwardRefWithAs } from '@stacks/ui-core';
import { Box } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

export const MenuWrapper = forwardRefWithAs((props, ref) => (
  <Box
    ref={ref}
    position="absolute"
    top="60px"
    right="space.06"
    borderRadius="10px"
    width="296px"
    boxShadow="0px 8px 16px rgba(27, 39, 51, 0.08);"
    zIndex={2000}
    border="1px solid"
    bg={token('colors.accent.background-primary')}
    borderColor={token('colors.accent.background-primary')}
    py="space.02"
    transformOrigin="top right"
    {...(props as any)}
  />
));
