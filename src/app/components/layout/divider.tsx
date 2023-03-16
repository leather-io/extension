import { Box, BoxProps, color } from '@stacks/ui';

export function Divider(props: BoxProps) {
  return <Box width="100%" height="1px" bg={color('border')} {...props} />;
}
