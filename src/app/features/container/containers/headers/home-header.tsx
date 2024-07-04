import { ReactNode } from 'react';

import { Flex, Grid, GridItem, HStack, styled } from 'leather-styles/jsx';

export interface HomeHeaderProps {
  settingsMenu?: ReactNode;
  networkBadge?: ReactNode;
  logo?: ReactNode;
}

export function HomeHeader({ settingsMenu, networkBadge, logo }: HomeHeaderProps) {
  return (
    <styled.header
      justifyContent="center"
      margin={{ base: 0, md: 'auto' }}
      p="space.04"
      bg="transparent"
      maxWidth={{ base: '100vw', md: 'fullPageMaxWidth' }}
      width="100%"
    >
      <Grid
        alignItems="center"
        // same as onboarding-header.tsx - don't need grid really as no title
        gridTemplateColumns={'auto 4fr auto'}
        gridAutoFlow="column"
        width="100%"
      >
        <GridItem justifySelf="start">
          <Flex py={{ base: 0, md: 'space.01' }}>{logo}</Flex>
        </GridItem>

        {/*  This grid item could be un-needed */}
        <GridItem margin="auto"></GridItem>
        <GridItem>
          <HStack alignItems="center" justifyContent="flex-end">
            {networkBadge}
            {settingsMenu}
          </HStack>
        </GridItem>
      </Grid>
    </styled.header>
  );
}
