import { createRpcSuccessResponse, supportedMethods } from '@leather.io/rpc';

import { makeSearchParamsWithDefaults } from '../messaging-utils';
import { defineRpcRequestHandler } from '../rpc-message-handler';

export const supportedMethodsHandler = defineRpcRequestHandler(
  supportedMethods.method,
  (message, port) => {
    const { tabId } = makeSearchParamsWithDefaults(port);
    chrome.tabs.sendMessage(
      tabId,
      createRpcSuccessResponse(supportedMethods.method, {
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
);
