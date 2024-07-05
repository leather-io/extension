import { ReactNode } from 'react';

import { Flex, Grid, GridItem, HStack, styled } from 'leather-styles/jsx';

interface PopupHeaderProps {
  account?: ReactNode;
  totalBalance?: ReactNode;
  networkBadge?: ReactNode;
  logo?: ReactNode;
}

export function PopupHeader({ account, totalBalance, networkBadge, logo }: PopupHeaderProps) {
  const logoItem = logo || account;

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
        // don't think these ever have a title, page is the only one
        gridTemplateColumns="auto 4fr auto"
        gridAutoFlow="column"
        width="100%"
      >
        <GridItem justifySelf="start">
          {logoItem && <Flex py={{ base: 0, md: 'space.01' }}>{account ? account : logo}</Flex>}
        </GridItem>
        <GridItem margin="auto">
          {/* {title && <styled.span textStyle="heading.05">{title}</styled.span>} */}
        </GridItem>
        <GridItem>
          <HStack alignItems="center" justifyContent="flex-end">
            {networkBadge}
            {totalBalance && totalBalance}
          </HStack>
        </GridItem>
      </Grid>
    </styled.header>
  );
}
