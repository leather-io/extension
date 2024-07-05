import { RouteUrls } from '@shared/route-urls';

import { isKnownPopupRoute } from './get-popup-header';

export function isLandingPage(pathname: RouteUrls) {
  return pathname.match(RouteUrls.Onboarding); // need to match get-started/ledger
}

export function getIsSessionLocked(pathname: RouteUrls) {
  return pathname === RouteUrls.Unlock;
}

export function isSummaryPage(pathname: RouteUrls) {
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

export function canGoBack(pathname: RouteUrls) {
  if (getIsSessionLocked(pathname) || isKnownPopupRoute(pathname) || isSummaryPage(pathname)) {
    return false;
  }
  return true;
}

export function hideLogo(pathname: RouteUrls) {
  return pathname === RouteUrls.RpcGetAddresses || pathname === RouteUrls.ViewSecretKey;
}

export function isNoHeaderPopup(pathname: RouteUrls) {
  return pathname === RouteUrls.RpcGetAddresses || pathname === RouteUrls.ChooseAccount;
}

export function hideSettingsOnSm(pathname: RouteUrls) {
  switch (pathname) {
    case RouteUrls.SendCryptoAsset:
    case RouteUrls.FundChooseCurrency:
      return true;
    default:
      return false;
  }
}
