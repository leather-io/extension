import { supportedMethodsMethodName } from '@leather.io/rpc';

import { SupportedMethodsRequest } from '@shared/rpc/methods/supported-methods';
import { makeRpcSuccessResponse } from '@shared/rpc/rpc-methods';

import { makeSearchParamsWithDefaults } from '../messaging-utils';

export function rpcSupportedMethods(message: SupportedMethodsRequest, port: chrome.runtime.Port) {
  const { tabId } = makeSearchParamsWithDefaults(port);
  chrome.tabs.sendMessage(
    tabId,
    makeRpcSuccessResponse(supportedMethodsMethodName, {
      id: message.id,
      result: {
        documentation: 'https://leather.gitbook.io/developers/home/welcome',
        methods: [
          {
            name: 'open',
            docsUrl: ['https://leather.gitbook.io/developers/bitcoin/connect-users/open'],
          },
          {
            name: 'getAddresses',
            docsUrl: [
              'https://leather.gitbook.io/developers/bitcoin/connect-users/get-addresses',
              'https://btckit.org/docs/requests/getaddresses',
            ],
          },
          {
            name: 'signMessage',
            docsUrl: 'https://leather.gitbook.io/developers/bitcoin/sign-messages',
          },
          {
            name: 'sendTransfer',
            docsUrl:
              'https://leather.gitbook.io/developers/bitcoin/sign-transactions/sending-bitcoin',
          },
          {
            name: 'signPsbt',
            docsUrl:
              'https://leather.gitbook.io/developers/bitcoin/sign-transactions/partially-signed-bitcoin-transactions-psbts',
          },
          {
            name: 'openSwap',
            docsUrl: 'https://leather.gitbook.io/developers/bitcoin/swaps/open-swap',
          },
        ],
      },
    })
  );
}
