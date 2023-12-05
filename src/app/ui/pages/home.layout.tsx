import type { ReactNode } from 'react';

import { HomePageSelectors } from '@tests/selectors/home.selectors';
import { Box, Stack } from 'leather-styles/jsx';

interface HomeLayoutProps {
  children: ReactNode;
  accountCard: ReactNode;
}

export function HomeLayout({ children, accountCard }: HomeLayoutProps) {
  return (
    <Stack
      data-testid={HomePageSelectors.HomePageContainer}
      maxWidth={{ base: 'unset', md: 'fullPageMaxWidth' }}
      px={{ base: 0, md: 'space.04' }}
      py={{ base: 0, md: 'space.07' }}
      gap={{ base: 0, md: 'space.06' }}
      width="100%"
      bg="ink.1"
      borderRadius="lg"
      animation="fadein"
      animationDuration="500ms"
    >
      <Box px={{ base: 'space.05', md: 0 }} pb={{ base: 'space.05', md: 0 }}>
        {accountCard}
      </Box>
      {children}
    </Stack>
  );
}
