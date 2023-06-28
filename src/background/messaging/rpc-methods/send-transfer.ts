import { RpcErrorCode, SendTransferRequest } from '@btckit/types';

import { RouteUrls } from '@shared/route-urls';
import {
  getRpcSendTransferParamErrors,
  validateRpcSendTransferParams,
} from '@shared/rpc/methods/send-transfer';
import { makeRpcErrorResponse } from '@shared/rpc/rpc-methods';
import { isDefined, isUndefined } from '@shared/utils';

import {
  RequestParams,
  getTabIdFromPort,
  listenForPopupClose,
  makeSearchParamsWithDefaults,
  triggerRequestWindowOpen,
} from '../messaging-utils';

export async function rpcSendTransfer(message: SendTransferRequest, port: chrome.runtime.Port) {
  if (isUndefined(message.params)) {
    chrome.tabs.sendMessage(
      getTabIdFromPort(port),
      makeRpcErrorResponse('sendTransfer', {
        id: message.id,
        error: { code: RpcErrorCode.INVALID_REQUEST, message: 'Parameters undefined' },
      })
    );
    return;
  }

  if (!validateRpcSendTransferParams(message.params)) {
    chrome.tabs.sendMessage(
      getTabIdFromPort(port),
      makeRpcErrorResponse('sendTransfer', {
        id: message.id,
        error: {
          code: RpcErrorCode.INVALID_PARAMS,
          message: getRpcSendTransferParamErrors(message.params),
        },
      })
    );
    return;
  }

  const requestParams: RequestParams = [
    ['address', message.params.address],
    ['amount', message.params.amount],
    ['network', (message.params as any).network ?? 'mainnet'],
    ['requestId', message.id],
  ];

  if (isDefined((message.params as any).account)) {
    requestParams.push(['accountIndex', (message.params as any).account.toString()]);
  }

  const { urlParams, tabId } = makeSearchParamsWithDefaults(port, requestParams);

  const { id } = await triggerRequestWindowOpen(RouteUrls.RpcSendTransfer, urlParams);

  listenForPopupClose({
    tabId,
    id,
    response: makeRpcErrorResponse('sendTransfer', {
      id: message.id,
      error: {
        code: RpcErrorCode.USER_REJECTION,
        message: 'User rejected signing the transaction',
      },
    }),
  });
}
