import { ReactNode } from 'react';

import { SharedComponentsSelectors } from '@tests/selectors/shared-component.selectors';
import { Flex, Grid, GridItem, HStack, styled } from 'leather-styles/jsx';

import { ArrowLeftIcon, CloseIcon } from '@app/ui/icons';

import { HeaderActionButton } from './header-action-button';

export interface HeaderProps {
  variant: 'page' | 'home' | 'onboarding' | 'dialog' | 'receive';
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
    <styled.header p="space.04" bg={{ base: 'ink.background-primary', sm: 'transparent' }}>
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
                  icon={<ArrowLeftIcon data-testid={SharedComponentsSelectors.HeaderBackBtn} />}
                  isWaitingOnPerformedAction={isWaitingOnPerformedAction}
                  onAction={onGoBack}
                  hideFrom={variant === 'receive' ? 'md' : undefined}
                />
              ) : undefined}
              {account ? account : logo}
            </Flex>
          )}
        </GridItem>
        <GridItem margin="auto">
          {title && <styled.span textStyle="heading.05">{title}</styled.span>}
        </GridItem>
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
                hideBelow={variant === 'receive' ? 'md' : undefined}
              />
            )}
          </HStack>
        </GridItem>
      </Grid>
    </styled.header>
  );
}
