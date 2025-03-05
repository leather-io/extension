import {
  RpcErrorCode,
  createRpcErrorResponse,
  encodeBase64Json,
  stxCallContract,
} from '@leather.io/rpc';

import { RouteUrls } from '@shared/route-urls';
import { RpcErrorMessage } from '@shared/rpc/methods/validation.utils';

import {
  listenForPopupClose,
  makeSearchParamsWithDefaults,
  triggerRequestWindowOpen,
  validateRequestParams,
} from '../messaging-utils';
import { trackRpcRequestSuccess } from '../rpc-helpers';
import { defineRpcRequestHandler } from '../rpc-message-handler';

export const stxCallContractHandler = defineRpcRequestHandler(
  stxCallContract.method,
  async (message, port) => {
    const { id: requestId, method, params } = message;
    const { status } = validateRequestParams({
      id: requestId,
      method,
      params,
      port,
      schema: stxCallContract.params,
    });
    if (status === 'failure') return;
    const { tabId, urlParams } = makeSearchParamsWithDefaults(port, [
      ['requestId', message.id],
      ['rpcRequest', encodeBase64Json(message)],
    ]);

    if (message.params && message.params.network) {
      urlParams.append('network', message.params.network);
    }
    const { id } = await triggerRequestWindowOpen(RouteUrls.RpcStxCallContract, urlParams);
    void trackRpcRequestSuccess({ endpoint: message.method });

    listenForPopupClose({
      tabId,
      id,
      response: createRpcErrorResponse(method, {
        id: requestId,
        error: {
          code: RpcErrorCode.USER_REJECTION,
          message: RpcErrorMessage.UserRejectedRequest,
        },
      }),
    });
  }
);
