import { RpcErrorCode } from '@btckit/types';
import { deserializeTransaction } from '@stacks/transactions';

import { RouteUrls } from '@shared/route-urls';
import {
  SignStacksTransactionRequest,
  getRpcSignStacksTransactionParamErrors,
  validateRpcSignStacksTransactionParams,
} from '@shared/rpc/methods/sign-stacks-transaction';
import { makeRpcErrorResponse } from '@shared/rpc/rpc-methods';
import { isDefined, isUndefined } from '@shared/utils';

import {
  RequestParams,
  getTabIdFromPort,
  listenForPopupClose,
  makeSearchParamsWithDefaults,
  triggerRequestWindowOpen,
} from '../messaging-utils';

function validateStacksTransaction(txHex: string) {
  try {
    deserializeTransaction(txHex);
    return true;
  } catch (e) {
    return false;
  }
}

export async function rpcSignStacksTransaction(
  message: SignStacksTransactionRequest,
  port: chrome.runtime.Port
) {
  if (isUndefined(message.params)) {
    chrome.tabs.sendMessage(
      getTabIdFromPort(port),
      makeRpcErrorResponse('signStacksTransaction', {
        id: message.id,
        error: { code: RpcErrorCode.INVALID_REQUEST, message: 'Parameters undefined' },
      })
    );
    return;
  }

  if (!validateRpcSignStacksTransactionParams(message.params)) {
    chrome.tabs.sendMessage(
      getTabIdFromPort(port),
      makeRpcErrorResponse('signStacksTransaction', {
        id: message.id,
        error: {
          code: RpcErrorCode.INVALID_PARAMS,
          message: getRpcSignStacksTransactionParamErrors(message.params),
        },
      })
    );
    return;
  }

  if (!validateStacksTransaction(message.params.txHex!)) {
    chrome.tabs.sendMessage(
      getTabIdFromPort(port),
      makeRpcErrorResponse('signStacksTransaction', {
        id: message.id,
        error: { code: RpcErrorCode.INVALID_PARAMS, message: 'Invalid Stacks transaction hex' },
      })
    );
    return;
  }

  const requestParams = [
    ['stxAddress', message.params.stxAddress],
    ['txHex', message.params.txHex],
    ['requestId', message.id],
  ] as RequestParams;

  if (isDefined(message.params.attachment)) {
    requestParams.push(['attachment', message.params.attachment]);
  }

  if (isDefined(message.params.network)) {
    requestParams.push(['network', message.params.network]);
  }

  const { urlParams, tabId } = makeSearchParamsWithDefaults(port, requestParams);

  const { id } = await triggerRequestWindowOpen(RouteUrls.RpcSignStacksTransaction, urlParams);

  listenForPopupClose({
    tabId,
    id,
    response: makeRpcErrorResponse('signStacksTransaction', {
      id: message.id,
      error: {
        code: RpcErrorCode.USER_REJECTION,
        message: 'User rejected the Stacks transaction signing request',
      },
    }),
  });
}
