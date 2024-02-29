import { type ReactNode } from 'react';

import { Box } from 'leather-styles/jsx';

interface PageProps {
  children: ReactNode;
  showLogo?: boolean;
}

export function Page({ children }: PageProps) {
  return (
    <Box
      bg="ink.background-primary"
      // TODO ask design RE borderRadius as not consistent
      // Send / Swap have 'lg'
      borderRadius={{ base: 'unset', md: 'lg' }}
      width="pageWidth"
      height={{ base: '100%', md: 'fit-content' }}
      minHeight="435px"
    >
      {children}
    </Box>
  );
}
