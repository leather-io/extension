import { Box, BoxProps, color } from '@stacks/ui';

export const Divider = (props: BoxProps) => (
  <Box width="100%" height="1px" bg={color('border')} {...props} />
);
