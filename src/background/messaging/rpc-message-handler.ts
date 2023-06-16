import { RpcErrorCode } from '@btckit/types';

import { WalletRequests, makeRpcErrorResponse } from '@shared/rpc/rpc-methods';
import { makeSearchParamsWithDefaults } from './messaging-utils';
import { triggerRequestWindowOpen } from './messaging-utils';
import { listenForPopupClose } from './messaging-utils';
import { RouteUrls } from '@shared/route-urls';

import { getTabIdFromPort } from './messaging-utils';
import { rpcGetAddresses } from './rpc-methods/get-addresses';
import { rpcSendTransfer } from './rpc-methods/send-transfer';
import { rpcSignMessage } from './rpc-methods/sign-message';
import { rpcSignPsbt } from './rpc-methods/sign-psbt';
import { rpcSupportedMethods } from './rpc-methods/supported-methods';

export async function rpcMessageHandler(message: WalletRequests, port: chrome.runtime.Port) {
  switch (message.method) {
    case 'getAddresses': {
      await rpcGetAddresses(message, port);
      break;
    }

    case 'signMessage': {
      await rpcSignMessage(message, port);
      break;
    }

    case 'sendTransfer': {
      await rpcSendTransfer(message, port);
      break;
    }

    case 'signPsbt': {
      await rpcSignPsbt(message, port);
      break;
    }

    case 'supportedMethods': {
      rpcSupportedMethods(message, port);
      break;
    }

    case 'acceptOffer': {
      if (!message.params) {
        chrome.tabs.sendMessage(
          getTabIdFromPort(port),
          makeRpcErrorResponse('acceptOffer', {
            id: message.id,
            error: {
              code: RpcErrorCode.INVALID_PARAMS,
              message:
                'Invalid offer parameters',
            },
          })
        );
        break;
      }

        if (message.params.bitcoinContractOffer.includes('Invalid state: Not enough fund in utxos')) {
          chrome.tabs.sendMessage(
            getTabIdFromPort(port),
            makeRpcErrorResponse('acceptOffer', {
              id: message.id,
              error: {
                code: RpcErrorCode.INVALID_REQUEST,
                message:
                  'The counterparty does not have enough funds to complete the offer',
              },
            })
          );
          break;
        }

      const { urlParams, tabId } = makeSearchParamsWithDefaults(port, [
        ['bitcoinContractOffer', message.params?.bitcoinContractOffer!],
        ['counterpartyWalletURL', message.params?.counterpartyWalletURL!],
        ['counterpartyWalletName', message.params?.counterpartyWalletName!],
        ['counterpartyWalletIcon', message.params?.counterpartyWalletIcon!],
        ['requestID', message.id],
      ]);
      const { id } = await triggerRequestWindowOpen(RouteUrls.BitcoinContractOffer, urlParams);
      listenForPopupClose({
        tabId,
        id,
        response: makeRpcErrorResponse('acceptOffer', {
          id: message.id,
          error: {
            code: RpcErrorCode.USER_REJECTION,
            message: 'User rejected the offer',
          },
        }),
      });
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
