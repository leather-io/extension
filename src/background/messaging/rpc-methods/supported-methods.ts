import { SupportedMethodsRequest } from '@shared/rpc/methods/supported-methods';
import { makeRpcSuccessResponse } from '@shared/rpc/rpc-methods';

import { makeSearchParamsWithDefaults } from '../messaging-utils';

export function rpcSupportedMethods(message: SupportedMethodsRequest, port: chrome.runtime.Port) {
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
}
