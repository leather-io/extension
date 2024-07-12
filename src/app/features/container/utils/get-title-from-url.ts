import { RouteUrls } from '@shared/route-urls';

export function getTitleFromUrl(pathname: RouteUrls) {
  if (pathname.match(RouteUrls.SendCryptoAsset)) {
    // don't show send on first step of send flow or popuop transfer
    if (pathname === RouteUrls.SendCryptoAsset) return undefined;
    if (pathname === RouteUrls.RpcSendTransfer) return undefined;
    return 'Send';
  }

  switch (pathname) {
    case RouteUrls.AddNetwork:
      return 'Add a network';
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
