import { Box, color } from '@stacks/ui';
import { forwardRefWithAs } from '@stacks/ui-core';

export const MenuWrapper = forwardRefWithAs((props, ref) => (
  <Box
    ref={ref}
    position="absolute"
    top="60px"
    right="extra-loose"
    borderRadius="10px"
    width="296px"
    boxShadow="0px 8px 16px rgba(27, 39, 51, 0.08);"
    zIndex={2000}
    border="1px solid"
    bg={color('bg')}
    borderColor={color('border')}
    py="tight"
    transformOrigin="top right"
    {...(props as any)}
  />
));
