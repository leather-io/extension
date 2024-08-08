import { type ReactNode } from 'react';

import { Box } from 'leather-styles/jsx';

interface PageProps {
  children: ReactNode;
  showLogo?: boolean;
}

export function Page({ children }: PageProps) {
  return (
    <Box
      width="pageWidth"
      height={{ base: '100%', md: 'fit-content' }}
      border={{ base: 'unset', sm: 'default' }}
      rounded="lg"
    >
      {children}
    </Box>
  );
}
