import * as btc from '@scure/btc-signer';
import { hexToBytes } from '@stacks/common';

import { RpcErrorCode, createRpcErrorResponse, signPsbt } from '@leather.io/rpc';
import { ensureArray, isDefined, isUndefined } from '@leather.io/utils';

import { RouteUrls } from '@shared/route-urls';
import {
  formatValidationErrors,
  getRpcParamErrors,
  validateRpcParams,
} from '@shared/rpc/methods/validation.utils';

import { trackRpcRequestError, trackRpcRequestSuccess } from '../rpc-helpers';
import { defineRpcRequestHandler } from '../rpc-message-handler';
import {
  RequestParams,
  createConnectingAppSearchParamsWithLastKnownAccount,
  getTabIdFromPort,
  sendErrorResponseOnUserPopupClose,
  triggerRequestPopupWindowOpen,
} from '../rpc-request-utils';

function validatePsbt(hex: string) {
  try {
    btc.Transaction.fromPSBT(hexToBytes(hex));
    return true;
  } catch (e) {
    return false;
  }
}

function validateRpcSignPsbtParams(obj: unknown) {
  return validateRpcParams(obj, signPsbt.params);
}

function getRpcSignPsbtParamErrors(obj: unknown) {
  return formatValidationErrors(getRpcParamErrors(obj, signPsbt.params));
}
export const signPsbtHandler = defineRpcRequestHandler(signPsbt.method, async (request, port) => {
  if (isUndefined(request.params)) {
    void trackRpcRequestError({ endpoint: request.method, error: 'Undefined parameters' });
    chrome.tabs.sendMessage(
      getTabIdFromPort(port),
      createRpcErrorResponse(request.method, {
        id: request.id,
        error: { code: RpcErrorCode.INVALID_REQUEST, message: 'Parameters undefined' },
      })
    );
    return;
  }

  if (!validateRpcSignPsbtParams(request.params)) {
    void trackRpcRequestError({ endpoint: request.method, error: 'Invalid parameters' });
    chrome.tabs.sendMessage(
      getTabIdFromPort(port),
      createRpcErrorResponse(request.method, {
        id: request.id,
        error: {
          code: RpcErrorCode.INVALID_PARAMS,
          message: getRpcSignPsbtParamErrors(request.params),
        },
      })
    );
    return;
  }

  if (!validatePsbt(request.params.hex)) {
    void trackRpcRequestError({ endpoint: request.method, error: 'Invalid PSBT' });

    chrome.tabs.sendMessage(
      getTabIdFromPort(port),
      createRpcErrorResponse('signPsbt', {
        id: request.id,
        error: { code: RpcErrorCode.INVALID_PARAMS, message: 'Invalid PSBT hex' },
      })
    );
    return;
  }

  const requestParams: RequestParams = [
    ['hex', request.params.hex],
    ['requestId', request.id],
  ];

  if (isDefined(request.params.account)) {
    requestParams.push(['accountIndex', request.params.account.toString()]);
  }

  if (isDefined(request.params.broadcast)) {
    requestParams.push(['broadcast', request.params.broadcast.toString()]);
  }

  if (isDefined(request.params.network)) {
    requestParams.push(['network', request.params.network.toString()]);
  }

  if (isDefined(request.params.signAtIndex))
    ensureArray(request.params.signAtIndex).forEach(index =>
      requestParams.push(['signAtIndex', index.toString()])
    );

  void trackRpcRequestSuccess({ endpoint: request.method });

  const { urlParams, tabId } = await createConnectingAppSearchParamsWithLastKnownAccount(
    port,
    requestParams
  );

  const { id } = await triggerRequestPopupWindowOpen(RouteUrls.RpcSignPsbt, urlParams);

  sendErrorResponseOnUserPopupClose({
    tabId,
    id,
    request,
    message: 'User rejected signing PSBT request',
  });
});
