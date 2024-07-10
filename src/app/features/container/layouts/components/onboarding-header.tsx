import { ReactNode } from 'react';

import { SharedComponentsSelectors } from '@tests/selectors/shared-component.selectors';
import { Flex, Grid, GridItem, HStack, styled } from 'leather-styles/jsx';

import { ArrowLeftIcon } from '@leather.io/ui';

import { HeaderActionButton } from '../../../../ui/layout/containers/headers/components/header-action-button';

interface HeaderProps {
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
      paddingLeft={{ base: undefined, sm: 0 }}
      bg="transparent"
      maxWidth={{ base: '100vw', md: 'fullPageMaxWidth' }}
      width="100%"
    >
      <Grid alignItems="center" gridTemplateColumns="auto" gridAutoFlow="column" width="100%">
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

        <GridItem>
          <HStack alignItems="center" justifyContent="flex-end">
            {networkBadge}
          </HStack>
        </GridItem>
      </Grid>
    </styled.header>
  );
}
