import { type RpcRequest, encodeBase64Json, getAddresses, stxGetAddresses } from '@leather.io/rpc';

import { RouteUrls } from '@shared/route-urls';

import { trackRpcRequestSuccess } from '../rpc-helpers';
import { defineRpcRequestHandler } from '../rpc-message-handler';
import {
  makeSearchParamsWithDefaults,
  sendErrorResponseOnUserPopupClose,
  triggerRequestPopupWindowOpen,
} from '../rpc-request-utils';

const sharedGetAddressesHandler = async (
  request: RpcRequest<typeof getAddresses> | RpcRequest<typeof stxGetAddresses>,
  port: chrome.runtime.Port
) => {
  const { urlParams, tabId } = await makeSearchParamsWithDefaults(port, [
    ['requestId', request.id],
    ['rpcRequest', encodeBase64Json(request)],
  ]);

  if (request.params && request.params.network) {
    urlParams.append('network', request.params.network);
  }

  const { id } = await triggerRequestPopupWindowOpen(RouteUrls.RpcGetAddresses, urlParams);
  void trackRpcRequestSuccess({ endpoint: request.method });

  sendErrorResponseOnUserPopupClose({ tabId, id, request });
};

export const getAddressesHandler = defineRpcRequestHandler(
  getAddresses.method,
  sharedGetAddressesHandler
);

export const stxGetAddressesHandler = defineRpcRequestHandler(
  stxGetAddresses.method,
  sharedGetAddressesHandler
);
