import { ReactElement } from 'react';

import { Box } from '@stacks/ui';

export function InscriptionPreviewContainer(props: { children: ReactElement }) {
  return (
    <Box
      width="100px"
      height="100px"
      borderRadius="8px"
      overflow="hidden"
      bg="black"
      position="relative"
    >
      {props.children}
    </Box>
  );
}
