import { ReactNode } from 'react';

import { SharedComponentsSelectors } from '@tests/selectors/shared-component.selectors';
import { Flex, Grid, GridItem, HStack, styled } from 'leather-styles/jsx';

import { ArrowLeftIcon, CloseIcon } from '@app/ui/icons';

import { BigTitleHeader } from './components/big-title-header';
import { HeaderActionButton } from './components/header-action-button';

type HeaderVariants = 'page' | 'home' | 'onboarding' | 'dialog' | 'bigTitle' | 'fund';

export interface HeaderProps {
  variant: HeaderVariants;
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
      justifyContent="center"
      margin={{ base: 0, md: 'auto' }}
      p={variant === 'bigTitle' ? 'space.05' : 'space.04'}
      paddingLeft={variant === 'onboarding' ? 0 : undefined}
      bg="transparent"
      maxWidth={{ base: '100vw', md: 'fullPageMaxWidth' }}
      width="100%"
    >
      <Grid
        alignItems="center"
        gridTemplateColumns={title ? '2fr 4fr 2fr' : 'auto 4fr auto'}
        gridAutoFlow="column"
        width="100%"
        hideFrom={variant === 'bigTitle' ? 'md' : undefined}
      >
        <GridItem justifySelf="start">
          {logoItem && (
            <Flex py={{ base: 0, md: 'space.01' }}>
              {variant !== 'home' && onGoBack ? (
                <HeaderActionButton
                  icon={<ArrowLeftIcon />}
                  isWaitingOnPerformedAction={isWaitingOnPerformedAction}
                  onAction={onGoBack}
                  dataTestId={SharedComponentsSelectors.HeaderBackBtn}
                />
              ) : undefined}
              {account ? account : logo}
            </Flex>
          )}
        </GridItem>
        <GridItem margin="auto" hideBelow={variant === 'bigTitle' ? 'md' : undefined}>
          {title && <styled.span textStyle="heading.05">{title}</styled.span>}
        </GridItem>
        <GridItem hideBelow={variant === 'bigTitle' ? 'md' : undefined}>
          <HStack alignItems="center" justifyContent="flex-end">
            {networkBadge}
            {totalBalance && totalBalance}
            {settingsMenu}
            {variant !== 'bigTitle' && onClose && (
              <HeaderActionButton
                icon={<CloseIcon />}
                dataTestId={SharedComponentsSelectors.HeaderCloseBtn}
                isWaitingOnPerformedAction={isWaitingOnPerformedAction}
                onAction={onClose}
              />
            )}
          </HStack>
        </GridItem>
      </Grid>
      {variant === 'bigTitle' && <BigTitleHeader title={title} onClose={onClose} />}
    </styled.header>
  );
}
