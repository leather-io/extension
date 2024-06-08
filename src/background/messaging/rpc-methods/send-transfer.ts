import { RpcErrorCode, type RpcRequest, type SendTransferRequestParams } from '@btckit/types';

import { isUndefined } from '@leather-wallet/utils';

import { RouteUrls } from '@shared/route-urls';
import {
  type RpcSendTransferParams,
  type RpcSendTransferParamsLegacy,
  convertRpcSendTransferLegacyParamsToNew,
  defaultRpcSendTransferNetwork,
  getRpcSendTransferParamErrors,
  validateRpcSendTransferLegacyParams,
  validateRpcSendTransferParams,
} from '@shared/rpc/methods/send-transfer';
import { makeRpcErrorResponse } from '@shared/rpc/rpc-methods';

import {
  RequestParams,
  getTabIdFromPort,
  listenForPopupClose,
  makeSearchParamsWithDefaults,
  triggerRequestWindowOpen,
} from '../messaging-utils';

export async function rpcSendTransfer(
  message: RpcRequest<'sendTransfer', RpcSendTransferParams | SendTransferRequestParams>,
  port: chrome.runtime.Port
) {
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

  // Legacy params support for backward compatibility
  const params = validateRpcSendTransferLegacyParams(message.params)
    ? convertRpcSendTransferLegacyParamsToNew(message.params as RpcSendTransferParamsLegacy)
    : (message.params as RpcSendTransferParams);

  if (!validateRpcSendTransferParams(params)) {
    chrome.tabs.sendMessage(
      getTabIdFromPort(port),
      makeRpcErrorResponse('sendTransfer', {
        id: message.id,
        error: {
          code: RpcErrorCode.INVALID_PARAMS,
          message: getRpcSendTransferParamErrors(params),
        },
      })
    );
    return;
  }

  const recipients: [string, string][] = params.recipients.map(({ address }) => [
    'recipient',
    address,
  ]);
  const amounts: [string, string][] = params.recipients.map(({ amount }) => ['amount', amount]);

  const requestParams: RequestParams = [
    ...recipients,
    ...amounts,
    ['network', params.network ?? defaultRpcSendTransferNetwork],
    ['requestId', message.id],
  ];

  if (params.account) {
    requestParams.push(['accountIndex', params.account.toString()]);
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
