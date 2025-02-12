import { type RpcRequest, createRpcSuccessResponse, supportedMethods } from '@leather.io/rpc';

import { makeSearchParamsWithDefaults } from '../messaging-utils';

export function rpcSupportedMethods(
  message: RpcRequest<typeof supportedMethods>,
  port: chrome.runtime.Port
) {
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
