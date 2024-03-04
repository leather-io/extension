import { RouteUrls } from '@shared/route-urls';

import { isKnownPopupRoute } from './get-popup-header';

function isHomePage(pathname: RouteUrls) {
  return (
    pathname === RouteUrls.Home ||
    pathname.match(RouteUrls.Activity) ||
    pathname.match(RouteUrls.Receive)
  );
}

export function isLandingPage(pathname: RouteUrls) {
  return pathname === RouteUrls.RequestDiagnostics || pathname.match(RouteUrls.Onboarding); // need to match get-started/ledger
}

const isOnboardingPage = (pathname: RouteUrls) => {
  return (
    pathname === RouteUrls.BackUpSecretKey ||
    pathname === RouteUrls.SetPassword ||
    pathname === RouteUrls.SignIn ||
    pathname === RouteUrls.ViewSecretKey
  );
};

export function getPageVariant(pathname: RouteUrls) {
  if (isHomePage(pathname)) return 'home';
  if (isOnboardingPage(pathname)) return 'onboarding';
  return 'page';
}

export function getIsSessionLocked(pathname: RouteUrls) {
  return pathname === RouteUrls.Unlock;
}

export function canGoBack(pathname: RouteUrls) {
  if (getIsSessionLocked(pathname) || isKnownPopupRoute(pathname)) {
    return false;
  }
  return true;
}

export function hideLogo(pathname: RouteUrls) {
  return pathname === RouteUrls.RpcGetAddresses;
}

export function isGetAddressesPopup(pathname: RouteUrls) {
  return pathname === RouteUrls.RpcGetAddresses;
}

export function hideSettingsOnSm(pathname: RouteUrls) {
  switch (pathname) {
    case RouteUrls.Send:
    case RouteUrls.FundChooseCurrency:
      return true;
    default:
      return false;
  }
}
