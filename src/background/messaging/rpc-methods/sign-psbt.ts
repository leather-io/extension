import { RpcErrorCode } from '@btckit/types';
import * as btc from '@scure/btc-signer';
import { hexToBytes } from '@stacks/common';

import { RouteUrls } from '@shared/route-urls';
import {
  SignPsbtRequest,
  getRpcSignPsbtParamErrors,
  validateRpcSignPsbtParams,
} from '@shared/rpc/methods/sign-psbt';
import { makeRpcErrorResponse } from '@shared/rpc/rpc-methods';
import { ensureArray, isDefined, isUndefined } from '@shared/utils';

import {
  RequestParams,
  getTabIdFromPort,
  listenForPopupClose,
  makeSearchParamsWithDefaults,
  triggerRequestWindowOpen,
} from '../messaging-utils';

function validatePsbt(hex: string) {
  try {
    btc.Transaction.fromPSBT(hexToBytes(hex));
    return true;
  } catch (e) {
    return false;
  }
}

export async function rpcSignPsbt(message: SignPsbtRequest, port: chrome.runtime.Port) {
  if (isUndefined(message.params)) {
    chrome.tabs.sendMessage(
      getTabIdFromPort(port),
      makeRpcErrorResponse('signPsbt', {
        id: message.id,
        error: { code: RpcErrorCode.INVALID_REQUEST, message: 'Parameters undefined' },
      })
    );
    return;
  }

  if (!validateRpcSignPsbtParams(message.params)) {
    chrome.tabs.sendMessage(
      getTabIdFromPort(port),
      makeRpcErrorResponse('signPsbt', {
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
    chrome.tabs.sendMessage(
      getTabIdFromPort(port),
      makeRpcErrorResponse('signPsbt', {
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

  const { urlParams, tabId } = makeSearchParamsWithDefaults(port, requestParams);

  const { id } = await triggerRequestWindowOpen(RouteUrls.RpcSignPsbt, urlParams);

  listenForPopupClose({
    tabId,
    id,
    response: makeRpcErrorResponse('signPsbt', {
      id: message.id,
      error: {
        code: RpcErrorCode.USER_REJECTION,
        message: 'User rejected signing PSBT request',
      },
    }),
  });
}
