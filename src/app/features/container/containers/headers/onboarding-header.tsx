import { ReactNode } from 'react';

import { ArrowLeftIcon } from '@leather.io/ui';
import { SharedComponentsSelectors } from '@tests/selectors/shared-component.selectors';
import { Flex, Grid, GridItem, HStack, styled } from 'leather-styles/jsx';

import { HeaderActionButton } from './components/header-action-button';

export interface HeaderProps {
  onClose?(): void;
  onGoBack?(): void;
  title?: ReactNode;
  settingsMenu?: ReactNode;
  networkBadge?: ReactNode;
  logo?: ReactNode;
}

export function OnboardingHeader({
  onGoBack,
  settingsMenu,
  networkBadge,
  title,
  logo,
}: HeaderProps) {
  const logoItem = onGoBack || logo;

  return (
    <styled.header
      justifyContent="center"
      margin={{ base: 0, md: 'auto' }}
      p="space.04"
      //   paddingLeft={{ base: undefined, sm: variant === 'onboarding' ? 0 : undefined }}
      paddingLeft={{ base: undefined, sm: 0 }} // add paddingLeft 0 on sm for onboarding
      bg="transparent"
      maxWidth={{ base: '100vw', md: 'fullPageMaxWidth' }}
      width="100%"
    >
      <Grid
        alignItems="center"
        gridTemplateColumns={title ? '2fr 4fr 2fr' : 'auto 4fr auto'}
        gridAutoFlow="column"
        width="100%"

        /*  hideFrom={variant === 'bigTitle' ? 'md' : undefined} // remove hideFrom */
      >
        <GridItem justifySelf="start">
          {logoItem && (
            <Flex py={{ base: 0, md: 'space.01' }}>
              {/* {variant !== 'home' && onGoBack ? ( */}
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
        {/* hideBelow={variant === 'bigTitle' ? 'md' : undefined} // remove hideBelow */}
        <GridItem margin="auto">
          {title && <styled.span textStyle="heading.05">{title}</styled.span>}
        </GridItem>
        {/* hideBelow={variant === 'bigTitle' ? 'md' : undefined} // remove hideBelow */}
        <GridItem>
          <HStack alignItems="center" justifyContent="flex-end">
            {networkBadge}
            {/* {totalBalance && totalBalance} */}
            {settingsMenu}
            {/* {variant !== 'bigTitle' && onClose && ( */}
            {/* {onClose && (
              <HeaderActionButton
                icon={<CloseIcon />}
                dataTestId={SharedComponentsSelectors.HeaderCloseBtn}
                onAction={onClose}
              />
            )} */}
          </HStack>
        </GridItem>
      </Grid>
      {/* {variant === 'bigTitle' && <BigTitleHeader title={title} onClose={onClose} />} */}
    </styled.header>
  );
}
