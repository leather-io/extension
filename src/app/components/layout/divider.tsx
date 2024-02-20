import { Box, BoxProps } from 'leather-styles/jsx';

export function Divider(props: BoxProps) {
  return <Box bg="ink.border-default" height="1px" width="100%" {...props} />;
}
