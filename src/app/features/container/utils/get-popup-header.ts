/**
 * POPUP header logic notes here -> https://github.com/leather-io/extension/issues/4371#issuecomment-1919114939
 */
import { RouteUrls } from '@shared/route-urls';

export function isRpcRoute(pathname: RouteUrls) {
  //RouteUrls.RpcReceiveBitcoinContractOffer
  if (pathname.match('/bitcoin-contract-offer')) return true;
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
    case RouteUrls.TransactionRequest:
    case RouteUrls.ProfileUpdateRequest:
    case RouteUrls.RpcSendTransfer:
    case RouteUrls.RpcSignPsbt:
    case RouteUrls.RpcSignBip322Message:
      return true;
    default:
      return false;
  }
}

export function showBalanceInfo(pathname: RouteUrls) {
  switch (pathname) {
    case RouteUrls.ProfileUpdateRequest:
    case RouteUrls.RpcSendTransfer:
      return true;
    case RouteUrls.TransactionRequest:
    default:
      return false;
  }
}

export function getDisplayAddresssBalanceOf(pathname: RouteUrls) {
  //  TODO it's unclear when to show ALL or STX balance here
  switch (pathname) {
    case RouteUrls.TransactionRequest:
    case RouteUrls.ProfileUpdateRequest:
    case RouteUrls.RpcSendTransfer:
      return 'all';
    default:
      return 'stx';
  }
}

export function isKnownPopupRoute(pathname: RouteUrls) {
  if (pathname.match('/bitcoin-contract-offer')) return true;
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
