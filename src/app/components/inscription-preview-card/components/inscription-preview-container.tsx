import { ReactElement } from 'react';

import { Box, BoxProps } from 'leather-styles/jsx';

export function InscriptionPreviewContainer(props: { children: ReactElement } & BoxProps) {
  return (
    <Box
      width="100px"
      height="100px"
      borderRadius="8px"
      overflow="hidden"
      bg="black"
      position="relative"
      {...props}
    >
      {props.children}
    </Box>
  );
}
