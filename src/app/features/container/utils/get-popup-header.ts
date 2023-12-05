/**
 * POPUP header logic notes here -> https://github.com/leather-wallet/extension/issues/4371#issuecomment-1919114939
 */
import { RouteUrls } from '@shared/route-urls';

export function showAccountInfo(pathname: RouteUrls) {
  return (
    pathname === RouteUrls.TransactionRequest ||
    pathname === RouteUrls.ProfileUpdateRequest ||
    pathname === RouteUrls.PsbtRequest
  );
}
export function getDisplayAddresssBalanceOf(pathname: RouteUrls) {
  switch (pathname) {
    case RouteUrls.TransactionRequest:
    case RouteUrls.ProfileUpdateRequest:
    case RouteUrls.PsbtRequest:
      return 'all';
    case RouteUrls.SignatureRequest:
    case RouteUrls.RpcGetAddresses:
      return undefined;
    default:
      return 'stx';
  }
}

export function isKnownPopupRoute(pathname: RouteUrls) {
  switch (pathname) {
    case RouteUrls.TransactionRequest:
    case RouteUrls.ProfileUpdateRequest:
    case RouteUrls.PsbtRequest:
    case RouteUrls.SignatureRequest:
    case RouteUrls.RpcGetAddresses:
      return true;
    default:
      return false;
  }
}
