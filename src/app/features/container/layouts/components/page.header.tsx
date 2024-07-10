import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ChainID } from '@stacks/transactions';
import { OnboardingSelectors } from '@tests/selectors/onboarding.selectors';
import { SettingsSelectors } from '@tests/selectors/settings.selectors';
import { SharedComponentsSelectors } from '@tests/selectors/shared-component.selectors';
import { Box, Flex, Grid, GridItem, HStack, styled } from 'leather-styles/jsx';

import { ArrowLeftIcon, CloseIcon, HamburgerIcon, Logo, NetworkModeBadge } from '@leather.io/ui';

import { RouteUrls } from '@shared/route-urls';

import { SwitchAccountDialog } from '@app/features/dialogs/switch-account-dialog/switch-account-dialog';
import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';

import { usePageContext } from '../../../../common/page/page.context';
import { HeaderActionButton } from '../../../../ui/layout/containers/headers/components/header-action-button';
import { Settings } from '../../../settings/settings';

function LogoBox({ isSessionLocked }: { isSessionLocked: boolean | undefined }) {
  const navigate = useNavigate();
  return (
    <Box
      height="headerContainerHeight"
      margin="auto"
      px="space.02"
      hideBelow={isSessionLocked ? undefined : 'sm'}
      hideFrom={isSessionLocked ? 'sm' : undefined}
    >
      <Logo
        data-testid={OnboardingSelectors.LogoRouteToHome}
        onClick={() => navigate(RouteUrls.Home)}
      />
    </Box>
  );
}

export function PageHeader() {
  const [isShowingSwitchAccount, setIsShowingSwitchAccount] = useState(false);
  const navigate = useNavigate();
  const { chain, name: chainName } = useCurrentNetworkState();

  const {
    state: { title, isSummaryPage, isSessionLocked, isSettingsVisibleOnSm, onBackLocation },
  } = usePageContext();

  // pages with nested dialogs need to specify onBackLocation
  // to go back and to prevent navigate(-1) re-opening the dialog
  const onGoBack = onBackLocation ? () => navigate(onBackLocation) : () => navigate(-1);
  const canGoBack = !isSummaryPage && !isSessionLocked;

  return (
    <>
      {isShowingSwitchAccount && (
        <SwitchAccountDialog
          isShowing={isShowingSwitchAccount}
          onClose={() => setIsShowingSwitchAccount(false)}
        />
      )}
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
            <Flex py={{ base: 0, md: 'space.01' }}>
              {canGoBack && (
                <HeaderActionButton
                  icon={<ArrowLeftIcon />}
                  onAction={onGoBack}
                  dataTestId={SharedComponentsSelectors.HeaderBackBtn}
                />
              )}
              <LogoBox isSessionLocked={isSessionLocked} />
            </Flex>
          </GridItem>
          <GridItem margin="auto">
            <styled.span textStyle="heading.05">{title}</styled.span>
          </GridItem>
          <GridItem>
            <HStack alignItems="center" justifyContent="flex-end">
              <NetworkModeBadge
                isTestnetChain={chain.stacks.chainId === ChainID.Testnet}
                name={chainName}
              />

              {!isSummaryPage && (
                <styled.div hideBelow={isSettingsVisibleOnSm ? undefined : 'sm'}>
                  <Settings
                    triggerButton={
                      <HamburgerIcon data-testid={SettingsSelectors.SettingsMenuBtn} />
                    }
                    toggleSwitchAccount={() => setIsShowingSwitchAccount(!isShowingSwitchAccount)}
                  />
                </styled.div>
              )}
              {isSummaryPage && (
                <HeaderActionButton
                  icon={<CloseIcon />}
                  dataTestId={SharedComponentsSelectors.HeaderCloseBtn}
                  onAction={() => navigate(RouteUrls.Home)}
                />
              )}
            </HStack>
          </GridItem>
        </Grid>
      </styled.header>
    </>
  );
}
