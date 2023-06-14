import { RpcErrorCode } from '@btckit/types';
import { SignMessageRequest } from '@btckit/types/dist/types/methods/sign-message';

import { isSupportedMessageSigningPaymentType } from '@shared/crypto/bitcoin/bip322/bip322-utils';
import { RouteUrls } from '@shared/route-urls';
import { makeRpcErrorResponse } from '@shared/rpc/rpc-methods';
import { isString } from '@shared/utils';

import {
  getTabIdFromPort,
  listenForPopupClose,
  makeSearchParamsWithDefaults,
  triggerRequestWindowOpen,
} from '../messaging-utils';

export async function rpcSignMessage(message: SignMessageRequest, port: chrome.runtime.Port) {
  if (!message.params || !isString(message.params.message)) {
    chrome.tabs.sendMessage(
      getTabIdFromPort(port),
      makeRpcErrorResponse('signMessage', {
        id: message.id,
        error: {
          code: RpcErrorCode.INVALID_PARAMS,
          message:
            'Invalid parameters. Message signing requires a message. See the btckit spec for more information: https://btckit.org/docs/spec',
        },
      })
    );
    return;
  }
  const paymentType = (message.params as any).paymentType ?? 'p2wpkh';
  if (!isSupportedMessageSigningPaymentType(paymentType)) {
    chrome.tabs.sendMessage(
      getTabIdFromPort(port),
      makeRpcErrorResponse('signMessage', {
        id: message.id,
        error: {
          code: RpcErrorCode.INVALID_PARAMS,
          message:
            'Unsupported payment type. Hiro Wallet only supports signing messages for Native Segwit (p2wpkh) and Taproot (p2tr) addresses.',
        },
      })
    );
    return;
  }
  const { urlParams, tabId } = makeSearchParamsWithDefaults(port, [
    ['message', message.params.message],
    ['requestId', message.id],
    ['paymentType', paymentType],
  ]);
  const { id } = await triggerRequestWindowOpen(RouteUrls.RpcSignBip322Message, urlParams);
  listenForPopupClose({
    tabId,
    id,
    response: makeRpcErrorResponse('signMessage', {
      id: message.id,
      error: {
        code: RpcErrorCode.USER_REJECTION,
        message: 'User rejected the message signature',
      },
    }),
  });
}
