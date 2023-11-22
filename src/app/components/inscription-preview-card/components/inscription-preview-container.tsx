import { Box, BoxProps } from 'leather-styles/jsx';

import { HasChildren } from '@app/common/has-children';

export function InscriptionPreviewContainer({ children, ...props }: HasChildren & BoxProps) {
  return (
    <Box
      bg="black"
      borderRadius="xs"
      width="100px"
      height="100px"
      overflow="hidden"
      position="relative"
      {...props}
    >
      {children}
    </Box>
  );
}
