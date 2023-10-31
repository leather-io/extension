import { Box, BoxProps } from 'leather-styles/jsx';

import { HasChildren } from '@app/common/has-children';

export function InscriptionPreviewContainer({ children, ...props }: HasChildren & BoxProps) {
  return (
    <Box
      bg="black"
      borderRadius="8px"
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
