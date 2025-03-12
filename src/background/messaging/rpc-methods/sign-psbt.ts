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

import {
  RequestParams,
  getTabIdFromPort,
  listenForPopupClose,
  makeSearchParamsWithDefaults,
  triggerRequestWindowOpen,
} from '../messaging-utils';
import { trackRpcRequestError, trackRpcRequestSuccess } from '../rpc-helpers';
import { defineRpcRequestHandler } from '../rpc-message-handler';

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
export const signPsbtHandler = defineRpcRequestHandler(signPsbt.method, async (message, port) => {
  if (isUndefined(message.params)) {
    void trackRpcRequestError({ endpoint: message.method, error: 'Undefined parameters' });
    chrome.tabs.sendMessage(
      getTabIdFromPort(port),
      createRpcErrorResponse(message.method, {
        id: message.id,
        error: { code: RpcErrorCode.INVALID_REQUEST, message: 'Parameters undefined' },
      })
    );
    return;
  }

  if (!validateRpcSignPsbtParams(message.params)) {
    void trackRpcRequestError({ endpoint: message.method, error: 'Invalid parameters' });
    chrome.tabs.sendMessage(
      getTabIdFromPort(port),
      createRpcErrorResponse(message.method, {
        id: message.id,
        error: {
          code: RpcErrorCode.INVALID_PARAMS,
          message: getRpcSignPsbtParamErrors(message.params),
        },
      })
    );
    return;
  }

  if (!validatePsbt(message.params.hex)) {
    void trackRpcRequestError({ endpoint: message.method, error: 'Invalid PSBT' });

    chrome.tabs.sendMessage(
      getTabIdFromPort(port),
      createRpcErrorResponse('signPsbt', {
        id: message.id,
        error: { code: RpcErrorCode.INVALID_PARAMS, message: 'Invalid PSBT hex' },
      })
    );
    return;
  }

  const requestParams: RequestParams = [
    ['hex', message.params.hex],
    ['requestId', message.id],
  ];

  if (isDefined(message.params.account)) {
    requestParams.push(['accountIndex', message.params.account.toString()]);
  }

  if (isDefined(message.params.broadcast)) {
    requestParams.push(['broadcast', message.params.broadcast.toString()]);
  }

  if (isDefined(message.params.network)) {
    requestParams.push(['network', message.params.network.toString()]);
  }

  if (isDefined(message.params.signAtIndex))
    ensureArray(message.params.signAtIndex).forEach(index =>
      requestParams.push(['signAtIndex', index.toString()])
    );

  void trackRpcRequestSuccess({ endpoint: message.method });

  const { urlParams, tabId } = makeSearchParamsWithDefaults(port, requestParams);

  const { id } = await triggerRequestWindowOpen(RouteUrls.RpcSignPsbt, urlParams);

  listenForPopupClose({
    tabId,
    id,
    response: createRpcErrorResponse('signPsbt', {
      id: message.id,
      error: {
        code: RpcErrorCode.USER_REJECTION,
        message: 'User rejected signing PSBT request',
      },
    }),
  });
});
