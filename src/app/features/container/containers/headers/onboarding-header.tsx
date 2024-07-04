import { ReactNode } from 'react';

import { SharedComponentsSelectors } from '@tests/selectors/shared-component.selectors';
import { Flex, Grid, GridItem, HStack, styled } from 'leather-styles/jsx';

import { ArrowLeftIcon } from '@leather.io/ui';

import { HeaderActionButton } from './components/header-action-button';

export interface HeaderProps {
  onClose?(): void;
  onGoBack?(): void;
  title?: ReactNode;
  settingsMenu?: ReactNode;
  networkBadge?: ReactNode;
  logo?: ReactNode;
}

export function OnboardingHeader({ onGoBack, networkBadge, logo }: HeaderProps) {
  const logoItem = onGoBack || logo;

  return (
    <styled.header
      justifyContent="center"
      margin={{ base: 0, md: 'auto' }}
      p="space.04"
      // add paddingLeft 0 on sm for onboarding
      // check this as can't remember whats correct
      paddingLeft={{ base: undefined, sm: 0 }}
      bg="transparent"
      maxWidth={{ base: '100vw', md: 'fullPageMaxWidth' }}
      width="100%"
    >
      {/* 
      This could probably be a Flex? Or maybe better to keep grid to share code 
      Have a grid wrapper  with an empty div middle? or that accepts children? and auto cols? 
      */}
      <Grid
        alignItems="center"
        // gridTemplateColumns="auto 4fr auto"
        gridTemplateColumns="auto auto"
        gridAutoFlow="column"
        width="100%"
      >
        <GridItem justifySelf="start">
          {logoItem && (
            <Flex py={{ base: 0, md: 'space.01' }}>
              {onGoBack && (
                <HeaderActionButton
                  icon={<ArrowLeftIcon />}
                  onAction={onGoBack}
                  dataTestId={SharedComponentsSelectors.HeaderBackBtn}
                />
              )}
              {logo}
            </Flex>
          )}
        </GridItem>

        <GridItem margin="auto">
          {/* {title && <styled.span textStyle="heading.05">{title}</styled.span>} */}
        </GridItem>
        <GridItem>
          {/* ViewSecretKey needs to show network badge */}
          <HStack alignItems="center" justifyContent="flex-end">
            {networkBadge}
          </HStack>
        </GridItem>
      </Grid>
    </styled.header>
  );
}
