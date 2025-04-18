import {
  RpcErrorCode,
  type RpcSendTransferLegacyParams,
  type RpcSendTransferParams,
  createRpcErrorResponse,
  sendTransfer,
} from '@leather.io/rpc';
import { isUndefined } from '@leather.io/utils';

import { RouteUrls } from '@shared/route-urls';
import {
  convertRpcSendTransferLegacyParamsToNew,
  defaultRpcSendTransferNetwork,
  getRpcSendTransferParamErrors,
  validateRpcSendTransferLegacyParams,
  validateRpcSendTransferParams,
} from '@shared/rpc/methods/send-transfer';

import { trackRpcRequestError, trackRpcRequestSuccess } from '../rpc-helpers';
import { defineRpcRequestHandler } from '../rpc-message-handler';
import {
  RequestParams,
  getTabIdFromPort,
  makeSearchParamsWithDefaults,
  sendErrorResponseOnUserPopupClose,
  triggerRequestPopupWindowOpen,
} from '../rpc-request-utils';

export const sendTransferHandler = defineRpcRequestHandler(
  sendTransfer.method,
  async (request, port) => {
    if (isUndefined(request.params)) {
      void trackRpcRequestError({ endpoint: 'sendTransfer', error: 'Undefined parameters' });

      chrome.tabs.sendMessage(
        getTabIdFromPort(port),
        createRpcErrorResponse('sendTransfer', {
          id: request.id,
          error: { code: RpcErrorCode.INVALID_REQUEST, message: 'Parameters undefined' },
        })
      );
      return;
    }

    // Legacy params support for backward compatibility
    const params = validateRpcSendTransferLegacyParams(request.params)
      ? convertRpcSendTransferLegacyParamsToNew(request.params as RpcSendTransferLegacyParams)
      : (request.params as RpcSendTransferParams);

    if (!validateRpcSendTransferParams(params)) {
      void trackRpcRequestError({ endpoint: 'sendTransfer', error: 'Invalid parameters' });

      chrome.tabs.sendMessage(
        getTabIdFromPort(port),
        createRpcErrorResponse('sendTransfer', {
          id: request.id,
          error: {
            code: RpcErrorCode.INVALID_PARAMS,
            message: getRpcSendTransferParamErrors(params),
          },
        })
      );
      return;
    }

    void trackRpcRequestSuccess({ endpoint: request.method });

    const recipients: [string, string][] = params.recipients.map(({ address }) => [
      'recipient',
      address,
    ]);
    const amounts: [string, string][] = params.recipients.map(({ amount }) => ['amount', amount]);

    const requestParams: RequestParams = [
      ...recipients,
      ...amounts,
      ['network', params.network ?? defaultRpcSendTransferNetwork],
      ['requestId', request.id],
    ];

    if (params.account) {
      requestParams.push(['accountIndex', params.account.toString()]);
    }

    const { urlParams, tabId } = await makeSearchParamsWithDefaults(port, requestParams);

    const { id } = await triggerRequestPopupWindowOpen(RouteUrls.RpcSendTransfer, urlParams);

    sendErrorResponseOnUserPopupClose({ tabId, id, request });
  }
);
