import {
  RpcErrorCode,
  createRpcErrorResponse,
  encodeBase64Json,
  stxTransferSip9Nft,
} from '@leather.io/rpc';

import { RouteUrls } from '@shared/route-urls';
import { RpcErrorMessage } from '@shared/rpc/methods/validation.utils';

import { trackRpcRequestSuccess } from '../rpc-helpers';
import { defineRpcRequestHandler } from '../rpc-message-handler';
import {
  createConnectingAppSearchParamsWithLastKnownAccount,
  listenForPopupClose,
  triggerRequestPopupWindowOpen,
  validateRequestParams,
} from '../rpc-request-utils';

export const stxTransferSip9NftHandler = defineRpcRequestHandler(
  stxTransferSip9Nft.method,
  async (request, port) => {
    const { id: requestId, method, params } = request;
    const { status } = validateRequestParams({
      id: requestId,
      method,
      params,
      port,
      schema: stxTransferSip9Nft.params,
    });
    if (status === 'failure') return;
    const { tabId, urlParams } = await createConnectingAppSearchParamsWithLastKnownAccount(port, [
      ['requestId', request.id],
      ['rpcRequest', encodeBase64Json(request)],
    ]);

    if (request.params && request.params.network) {
      urlParams.append('network', request.params.network);
    }
    const { id } = await triggerRequestPopupWindowOpen(RouteUrls.RpcStxTransferSip9Nft, urlParams);
    void trackRpcRequestSuccess({ endpoint: request.method });

    listenForPopupClose({
      tabId,
      id,
      response: createRpcErrorResponse(method, {
        id: requestId,
        error: {
          code: RpcErrorCode.USER_REJECTION,
          message: RpcErrorMessage.UserRejectedOperation,
        },
      }),
    });
  }
);
