import { ReactNode } from 'react';

import { Flex, Grid, GridItem, HStack, styled } from 'leather-styles/jsx';

import { isString } from '@shared/utils';

import { ArrowLeftIcon, CloseIcon } from '@app/ui/icons';

import { HeaderActionButton } from './header-action-button';

function Title({ title }: { title: string }) {
  return (
    <styled.span margin="auto" textStyle="heading.05">
      {title}
    </styled.span>
  );
}

export function BigTitle({ title }: { title: string }) {
  return (
    <styled.h1 textStyle="heading.03" maxWidth="bigTitleWidth" height="bigTitleHeight">
      {title}
    </styled.h1>
  );
}

export interface HeaderProps {
  variant: 'page' | 'home' | 'onboarding' | 'card'; //TODO add shared types
  isWaitingOnPerformedAction?: boolean;
  onClose?(): void;
  onGoBack?(): void;
  title?: ReactNode;
  account?: ReactNode;
  totalBalance?: ReactNode;
  settingsMenu?: ReactNode;
  networkBadge?: ReactNode;
  logo?: ReactNode;
}

export function Header({
  variant,
  isWaitingOnPerformedAction,
  onClose,
  onGoBack,
  account,
  totalBalance,
  settingsMenu,
  networkBadge,
  title,
  logo,
}: HeaderProps) {
  const logoItem = onGoBack || logo || account;
  return (
    <styled.header
      p={isString(title) ? 'space.04' : 'space.05'}
      bg={{ base: 'ink.background-primary', sm: 'transparent' }}
    >
      <Grid
        gridTemplateColumns="auto 4fr 1fr"
        // auto-fit seems good!
        // gridTemplateColumns="repeat(auto-fit, minmax(100px, 1fr))"
        gridAutoFlow="column"
        width="100%"
        maxWidth={{ base: '100vw', md: 'fullPageMaxWidth' }}
        margin={{ base: 0, md: 'auto' }}
        // alignItems="start"
        // justifyItems="start"
      >
        <GridItem justifySelf="start">
          {logoItem && (
            <Flex py={{ base: 0, md: 'space.01' }}>
              {variant !== 'home' && onGoBack ? (
                <HeaderActionButton
                  icon={<ArrowLeftIcon />}
                  isWaitingOnPerformedAction={isWaitingOnPerformedAction}
                  onAction={onGoBack}
                />
              ) : undefined}
              {account ? account : logo}
            </Flex>
          )}
        </GridItem>
        <GridItem margin="auto">{isString(title) ? <Title title={title} /> : title}</GridItem>
        <GridItem>
          <HStack alignItems="center" justifyContent="flex-end">
            {networkBadge}
            {totalBalance}
            {variant !== 'onboarding' && settingsMenu}

            {onClose && (
              <HeaderActionButton
                icon={<CloseIcon variant="small" />}
                isWaitingOnPerformedAction={isWaitingOnPerformedAction}
                onAction={onClose}
              />
            )}
          </HStack>
        </GridItem>
      </Grid>
    </styled.header>
  );
}
