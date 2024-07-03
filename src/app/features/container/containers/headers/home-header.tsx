import { ReactNode } from 'react';

import { Flex, Grid, GridItem, HStack, styled } from 'leather-styles/jsx';

export interface HomeHeaderProps {
  onClose?(): void;
  onGoBack?(): void;
  title?: ReactNode;
  account?: ReactNode;
  totalBalance?: ReactNode;
  settingsMenu?: ReactNode;
  networkBadge?: ReactNode;
  logo?: ReactNode;
}

export function HomeHeader({
  onClose,
  onGoBack,
  account,
  totalBalance,
  settingsMenu,
  networkBadge,
  title,
  logo,
}: HomeHeaderProps) {
  const logoItem = onGoBack || logo || account;

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
        gridTemplateColumns={title ? '2fr 4fr 2fr' : 'auto 4fr auto'}
        gridAutoFlow="column"
        width="100%"
      >
        <GridItem justifySelf="start">
          {/*  FIXME probably just needs to be logo here */}
          {logoItem && <Flex py={{ base: 0, md: 'space.01' }}>{account ? account : logo}</Flex>}
        </GridItem>

        {/*  No titles on home probably just needs to be logo here */}
        <GridItem margin="auto">
          {title && <styled.span textStyle="heading.05">{title}</styled.span>}
        </GridItem>
        <GridItem>
          <HStack alignItems="center" justifyContent="flex-end">
            {networkBadge}
            {/* no total balance for home */}
            {totalBalance && totalBalance}

            {settingsMenu}
            {/* no onClose for Home? */}
            {/* {variant !== 'bigTitle' && onClose && (
              <HeaderActionButton
                icon={<CloseIcon />}
                dataTestId={SharedComponentsSelectors.HeaderCloseBtn}
                onAction={onClose}
              />
            )} */}
          </HStack>
        </GridItem>
      </Grid>
    </styled.header>
  );
}
