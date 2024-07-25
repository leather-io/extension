import { RouteUrls } from '@shared/route-urls';

export function isRpcRoute(pathname: RouteUrls) {
  switch (pathname) {
    case RouteUrls.PsbtRequest:
    case RouteUrls.SignatureRequest:
    case RouteUrls.RpcStacksSignature:
    case RouteUrls.RpcSignBip322Message:
    case RouteUrls.RpcStacksSignature:
    case RouteUrls.RpcSignPsbt:
    case RouteUrls.RpcSignPsbtSummary:
    case RouteUrls.RpcSendTransfer:
    case RouteUrls.RpcSendTransferChooseFee:
    case RouteUrls.RpcSendTransferConfirmation:
    case RouteUrls.RpcSendTransferSummary:
      return true;
    default:
      return false;
  }
}

export function showAccountInfo(pathname: RouteUrls) {
  switch (pathname) {
    case RouteUrls.PsbtRequest:
    case RouteUrls.TransactionRequest:
    case RouteUrls.ProfileUpdateRequest:
    case RouteUrls.RpcSendTransfer:
    case RouteUrls.RpcSignPsbt:
    case RouteUrls.RpcSignBip322Message:
    case RouteUrls.SignatureRequest:
    case RouteUrls.RpcStacksSignature:
      return true;
    default:
      return false;
  }
}

export function showBalanceInfo(pathname: RouteUrls) {
  switch (pathname) {
    case RouteUrls.ProfileUpdateRequest:
    case RouteUrls.RpcSendTransfer:
    case RouteUrls.PsbtRequest:
    case RouteUrls.RpcSignBip322Message:
    case RouteUrls.RpcStacksSignature:
    case RouteUrls.TransactionRequest:
      return true;
    default:
      return false;
  }
}

export function getDisplayAddresssBalanceOf(pathname: RouteUrls) {
  switch (pathname) {
    case RouteUrls.ProfileUpdateRequest:
    case RouteUrls.RpcSendTransfer:
    case RouteUrls.PsbtRequest:
    case RouteUrls.RpcSignBip322Message:
      return 'all';
    case RouteUrls.RpcStacksSignature:
    case RouteUrls.TransactionRequest:
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
    case RouteUrls.RpcSendTransfer:
    case RouteUrls.SignatureRequest:
    case RouteUrls.RpcSignBip322Message:
    case RouteUrls.RpcStacksSignature:
    case RouteUrls.RpcSignPsbt:
    case RouteUrls.RpcSignPsbtSummary:
    case RouteUrls.RpcSendTransfer:
    case RouteUrls.RpcSendTransferChooseFee:
    case RouteUrls.RpcSendTransferConfirmation:
    case RouteUrls.RpcSendTransferSummary:
      return true;
    default:
      return false;
  }
}
