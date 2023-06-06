import { RpcErrorCode } from '@btckit/types';

import { isSupportedMessageSigningPaymentType } from '@shared/crypto/bitcoin/bip322/bip322-utils';
import { RouteUrls } from '@shared/route-urls';
import {
  WalletRequests,
  makeRpcErrorResponse,
  makeRpcSuccessResponse,
} from '@shared/rpc/rpc-methods';

import {
  getTabIdFromPort,
  listenForPopupClose,
  makeSearchParamsWithDefaults,
  triggerRequestWindowOpen,
} from './messaging-utils';

export async function rpcMessageHandler(message: WalletRequests, port: chrome.runtime.Port) {
  switch (message.method) {
    case 'getAddresses': {
      const { urlParams, tabId } = makeSearchParamsWithDefaults(port, [['requestId', message.id]]);
      const { id } = await triggerRequestWindowOpen(RouteUrls.RpcGetAddresses, urlParams);
      listenForPopupClose({
        tabId,
        id,
        response: {
          id: message.id,
          result: makeRpcErrorResponse('getAddresses', {
            id: message.id,
            error: {
              code: RpcErrorCode.USER_REJECTION,
              message: 'User rejected request to get addresses',
            },
          }),
        },
      });
      break;
    }

    case 'signMessage': {
      if (!message.params || !message.params.message) {
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
        break;
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
      break;
    }

    case 'sendTransfer': {
      if (!message.params) {
        chrome.tabs.sendMessage(
          getTabIdFromPort(port),
          makeRpcErrorResponse('sendTransfer', {
            id: message.id,
            error: {
              code: RpcErrorCode.INVALID_PARAMS,
              message:
                'Invalid parameters. See the btckit spec for more information: https://btckit.org/docs/spec',
            },
          })
        );
        break;
      }
      const { urlParams, tabId } = makeSearchParamsWithDefaults(port, [
        ['address', message.params.address],
        ['amount', message.params.amount],
        ['requestId', message.id],
      ]);
      const { id } = await triggerRequestWindowOpen(RouteUrls.RpcSendTransfer, urlParams);
      listenForPopupClose({
        tabId,
        id,
        response: makeRpcErrorResponse('sendTransfer', {
          id: message.id,
          error: {
            code: RpcErrorCode.USER_REJECTION,
            message: 'User rejected signing the transaction',
          },
        }),
      });
      break;
    }

    case 'supportedMethods': {
      const { tabId } = makeSearchParamsWithDefaults(port);
      chrome.tabs.sendMessage(
        tabId,
        makeRpcSuccessResponse('supportedMethods', {
          id: message.id,
          result: {
            documentation: 'https://hirowallet.gitbook.io/developers',
            methods: [
              {
                name: 'getAddresses',
                docsUrl: [
                  'https://hirowallet.gitbook.io/developers/bitcoin/connect-users/get-addresses',
                  'https://btckit.org/docs/requests/getaddresses',
                ],
              },
              {
                name: 'signMessage',
                docsUrl: 'https://hirowallet.gitbook.io/developers/bitcoin/sign-messages',
              },
              {
                name: 'sendTransfer',
              },
            ],
          },
        })
      );
      break;
    }

    default:
      chrome.tabs.sendMessage(
        getTabIdFromPort(port),
        makeRpcErrorResponse('' as any, {
          id: message.id,
          error: {
            code: RpcErrorCode.METHOD_NOT_FOUND,
            message: `"${message.method}" is not supported. Try running \`.request('supportedMethods')\` to see what Hiro Wallet can do, or check out our developer documentation at https://hirowallet.gitbook.io/developers`,
          },
        })
      );
      break;
  }
}
