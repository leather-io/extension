import { RpcErrorCode } from '@btckit/types';

import { RouteUrls } from '@shared/route-urls';
import { SignPsbtRequest } from '@shared/rpc/methods/sign-psbt';
import { makeRpcErrorResponse } from '@shared/rpc/rpc-methods';
import { ensureArray, isDefined } from '@shared/utils';

import {
  RequestParams,
  getTabIdFromPort,
  listenForPopupClose,
  makeSearchParamsWithDefaults,
  triggerRequestWindowOpen,
} from '../messaging-utils';

export async function rpcSignPsbt(message: SignPsbtRequest, port: chrome.runtime.Port) {
  if (!message.params || !message.params.hex) {
    chrome.tabs.sendMessage(
      getTabIdFromPort(port),
      makeRpcErrorResponse('signPsbt', {
        id: message.id,
        error: { code: RpcErrorCode.INVALID_PARAMS, message: 'Invalid parameters' },
      })
    );
    return;
  }

  const params: RequestParams = [
    ['requestId', message.id],
    ['hex', message.params.hex],
    ['publicKey', message.params.publicKey],
  ];

  if (isDefined(message.params.allowedSighash))
    ensureArray(message.params.allowedSighash).forEach(hash =>
      params.push(['allowedSighash', hash.toString()])
    );

  if (isDefined(message.params.signAtIndex))
    ensureArray(message.params.signAtIndex).forEach(index =>
      params.push(['signAtIndex', index.toString()])
    );

  const { urlParams, tabId } = makeSearchParamsWithDefaults(port, params);

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
