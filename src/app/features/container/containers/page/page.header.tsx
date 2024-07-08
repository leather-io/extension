import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ChainID } from '@stacks/transactions';
import { OnboardingSelectors } from '@tests/selectors/onboarding.selectors';
import { SettingsSelectors } from '@tests/selectors/settings.selectors';
import { SharedComponentsSelectors } from '@tests/selectors/shared-component.selectors';
import { Box, Flex, Grid, GridItem, HStack, styled } from 'leather-styles/jsx';

import { ArrowLeftIcon, CloseIcon, HamburgerIcon, Logo, NetworkModeBadge } from '@leather.io/ui';

import { RouteUrls } from '@shared/route-urls';

import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';

import { Settings } from '../../../settings/settings';
import { HeaderActionButton } from '../headers/components/header-action-button';
import { usePageContext } from './page.context';

// PETE - test this onGoBack function to see if its needed
// TODO: Refactor? This is very hard to manage with dynamic routes. Temporarily
// added a fix to catch the swap route: '/swap/:base/:quote?'
// function getOnGoBackLocation(pathname: RouteUrls) {
//   if (pathname.includes('/swap')) return navigate(RouteUrls.Home);
//   switch (pathname) {
//     case RouteUrls.Fund.replace(':currency', 'STX'):
//     case RouteUrls.Fund.replace(':currency', 'BTC'):
//     case RouteUrls.SendCryptoAssetForm.replace(':symbol', 'stx'):
//     case RouteUrls.SendCryptoAssetForm.replace(':symbol', 'btc'):
//       return navigate(RouteUrls.Home);
//     case RouteUrls.SendStxConfirmation:
//       return navigate(RouteUrls.SendCryptoAssetForm.replace(':symbol', 'stx'));
//     case RouteUrls.SendBtcConfirmation:
//       return navigate(RouteUrls.SendCryptoAssetForm.replace(':symbol', 'btc'));
//     default:
//       return navigate(-1);
//   }
// }

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

export function Header() {
  const navigate = useNavigate();
  const { chain, name: chainName } = useCurrentNetworkState();

  const [isShowingSwitchAccount, setIsShowingSwitchAccount] = useState(false);
  const {
    state: { title, isSummaryPage, isSessionLocked, isSettingsVisibleOnSm },
  } = usePageContext();

  // const onGoBack = onGoBack ? onGoBack : () => navigate(RouteUrls.Home);
  const canGoBack = !isSummaryPage && !isSessionLocked;
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
          <Flex py={{ base: 0, md: 'space.01' }}>
            {canGoBack && (
              <HeaderActionButton
                icon={<ArrowLeftIcon />}
                onAction={() => navigate(-1)}
                dataTestId={SharedComponentsSelectors.HeaderBackBtn}
              />
            )}
            <LogoBox isSessionLocked={isSessionLocked} />
          </Flex>
        </GridItem>
        <GridItem margin="auto">
          {title && <styled.span textStyle="heading.05">{title}</styled.span>}
        </GridItem>
        <GridItem>
          <HStack alignItems="center" justifyContent="flex-end">
            <NetworkModeBadge
              isTestnetChain={chain.stacks.chainId === ChainID.Testnet}
              name={chainName}
            />

            {!isSummaryPage && (
              <Settings
                triggerButton={
                  <HamburgerIcon
                    data-testid={SettingsSelectors.SettingsMenuBtn}
                    hideBelow={isSettingsVisibleOnSm ? undefined : 'sm'}
                  />
                }
                toggleSwitchAccount={() => setIsShowingSwitchAccount(!isShowingSwitchAccount)}
              />
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
  );
}
