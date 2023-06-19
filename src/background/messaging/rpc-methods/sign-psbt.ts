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
import { ensureArray, isDefined } from '@shared/utils';

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
  if (!validateRpcSignPsbtParams(message.params)) {
    const errors = getRpcSignPsbtParamErrors(message.params);
    chrome.tabs.sendMessage(
      getTabIdFromPort(port),
      makeRpcErrorResponse('signPsbt', {
        id: message.id,
        error: {
          code: RpcErrorCode.INVALID_PARAMS,
          message:
            'Invalid parameters: ' +
            errors.map(e => `Error in path ${e.path}, ${e.message}.`).join(' '),
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
    ['requestId', message.id],
    ['hex', message.params.hex],
    ['publicKey', message.params.publicKey],
    ['network', message.params.network ?? 'mainnet'],
  ];

  if (isDefined(message.params.account)) {
    requestParams.push(['accountIndex', message.params.account.toString()]);
  }

  if (isDefined(message.params.allowedSighash))
    ensureArray(message.params.allowedSighash).forEach(hash =>
      requestParams.push(['allowedSighash', hash.toString()])
    );

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
        message: 'User rejected the PSBT request',
      },
    }),
  });
}
