import { createContext, useContext, useReducer, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { ChainID } from '@stacks/transactions';
import { OnboardingSelectors } from '@tests/selectors/onboarding.selectors';
import { SettingsSelectors } from '@tests/selectors/settings.selectors';
import { Box } from 'leather-styles/jsx';

import { HamburgerIcon, Logo, NetworkModeBadge } from '@leather.io/ui';

import { RouteUrls } from '@shared/route-urls';

import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';

import { Settings } from '../../../settings/settings';
import { ContainerLayout } from '../container.layout';
import { Header } from '../headers/header';
import { PageProvider } from './page.context';

// PETE refactor this so that routes get title in app-routes instead
function getTitleFromUrl(pathname: RouteUrls) {
  if (pathname.match(RouteUrls.SendCryptoAsset)) {
    return 'Send';
  }
  // clearly not good but WIP fix
  if (pathname.match('swap')) {
    return 'Swap';
  }
  switch (pathname) {
    case RouteUrls.AddNetwork:
      return 'Add a network';
    case RouteUrls.BitcoinContractList:
      return 'Bitcoin Contracts';
    case RouteUrls.BitcoinContractLockSuccess:
      return 'Locked Bitcoin';
    case RouteUrls.SendBrc20ChooseFee:
      return 'Choose fee';
    case RouteUrls.SendBrc20Confirmation:
    case RouteUrls.SwapReview:
    case RouteUrls.SendBrc20Confirmation:
    case '/send/btc/confirm':
      return 'Review';
    case RouteUrls.Swap:
      return 'Swap';
    case RouteUrls.SentStxTxSummary:
    case RouteUrls.SentBtcTxSummary:
      return 'Sent';
    case RouteUrls.SentBrc20Summary:
      return 'Creating transfer inscription';
    case RouteUrls.SendBrc20Confirmation:
    default:
      return undefined;
  }
}

function getIsSessionLocked(pathname: RouteUrls) {
  return pathname === RouteUrls.Unlock;
}

function hideSettingsOnSm(pathname: RouteUrls) {
  switch (pathname) {
    case RouteUrls.SendCryptoAsset:
    case RouteUrls.FundChooseCurrency:
      return true;
    default:
      return false;
  }
}

function canGoBack(pathname: RouteUrls) {
  if (getIsSessionLocked(pathname) || isSummaryPage(pathname)) {
    return false;
  }
  return true;
}

function isSummaryPage(pathname: RouteUrls) {
  /* TODO refactor the summary routes to make this cleaner
  we need to block going back from summary pages catching the dynamic routes:
  SentBtcTxSummary = '/sent/btc/:txId',
  SentStxTxSummary = '/sent/stx/:txId',
  SentBrc20Summary = '/send/brc20/:ticker/summary',
  RpcSignPsbtSummary = '/sign-psbt/summary',
  RpcSendTransferSummary = '/send-transfer/summary',
  */
  return pathname.match('/sent/stx/') || pathname.match('/sent/btc/' || pathname.match('summary'));
}

interface PageLayoutProps {
  children?: React.JSX.Element | React.JSX.Element[];
}
export function PageLayout({ children }: PageLayoutProps) {
  const [isShowingSwitchAccount, setIsShowingSwitchAccount] = useState(false);
  const navigate = useNavigate();
  const { pathname: locationPathname } = useLocation();
  const pathname = locationPathname as RouteUrls;

  const { chain, name: chainName } = useCurrentNetworkState();

  const isSessionLocked = getIsSessionLocked(pathname);

  // TODO: Refactor? This is very hard to manage with dynamic routes. Temporarily
  // added a fix to catch the swap route: '/swap/:base/:quote?'
  function getOnGoBackLocation(pathname: RouteUrls) {
    if (pathname.includes('/swap')) return navigate(RouteUrls.Home);
    switch (pathname) {
      case RouteUrls.Fund.replace(':currency', 'STX'):
      case RouteUrls.Fund.replace(':currency', 'BTC'):
      case RouteUrls.SendCryptoAssetForm.replace(':symbol', 'stx'):
      case RouteUrls.SendCryptoAssetForm.replace(':symbol', 'btc'):
        return navigate(RouteUrls.Home);
      case RouteUrls.SendStxConfirmation:
        return navigate(RouteUrls.SendCryptoAssetForm.replace(':symbol', 'stx'));
      case RouteUrls.SendBtcConfirmation:
        return navigate(RouteUrls.SendCryptoAssetForm.replace(':symbol', 'btc'));
      default:
        return navigate(-1);
    }
  }
  const hideSettings = isSummaryPage(pathname);

  // const context = useContext(ExampleContext);

  // console.log('Context', context, ExampleContext);

  // const [language, setLanguage] = useState<string>('en');
  // const value = { language, setLanguage };
  // const { state } = usePageContext();

  // PETE language provider was working.

  // Page provider seems better but not sure how to use the
  // value in header without the error being thrown

  // seems quite close

  return (
    <PageProvider>
      {/* <LanguageContext.Provider value={{ language, setLanguage }}> */}
      {/* <ExampleProvider> */}
      <ContainerLayout
        header={
          <Header
            // maybe set these in location state of child routes?
            onGoBack={canGoBack(pathname) ? () => getOnGoBackLocation(pathname) : undefined}
            onClose={isSummaryPage(pathname) ? () => navigate(RouteUrls.Home) : undefined}
            settingsMenu={
              hideSettings ? null : (
                <Settings
                  triggerButton={
                    <HamburgerIcon
                      data-testid={SettingsSelectors.SettingsMenuBtn}
                      hideBelow={hideSettingsOnSm(pathname) ? 'sm' : undefined}
                    />
                  }
                  toggleSwitchAccount={() => setIsShowingSwitchAccount(!isShowingSwitchAccount)}
                />
              )
            }
            networkBadge={
              <NetworkModeBadge
                isTestnetChain={chain.stacks.chainId === ChainID.Testnet}
                name={chainName}
              />
            }
            title={getTitleFromUrl(pathname)}
            logo={
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
            }
          />
        }
        content={
          <>
            {/* <h1>{language}</h1> */}
            {/* <h2>{title}</h2> */}
            {children}
          </>
        }
      />
      {/* </ExampleProvider> */}
      {/* </LanguageContext.Provider> */}
    </PageProvider>
  );
}
