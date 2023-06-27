import { RpcErrorCode } from '@btckit/types';

import { RouteUrls } from '@shared/route-urls';
import { BitcoinContractRequest } from '@shared/rpc/methods/accept-bitcoin-contract';
import { makeRpcErrorResponse } from '@shared/rpc/rpc-methods';

import {
  RequestParams,
  getTabIdFromPort,
  listenForPopupClose,
  makeSearchParamsWithDefaults,
  triggerRequestWindowOpen,
} from '../messaging-utils';

export async function rpcAcceptBitcoinContractOffer(
  message: BitcoinContractRequest,
  port: chrome.runtime.Port
) {
  if (!message.params) {
    chrome.tabs.sendMessage(
      getTabIdFromPort(port),
      makeRpcErrorResponse('acceptBitcoinContractOffer', {
        id: message.id,
        error: { code: RpcErrorCode.INVALID_PARAMS, message: 'Invalid parameters' },
      })
    );
    return;
  }

  const params: RequestParams = [
    ['bitcoinContractOffer', message.params.bitcoinContractOffer],
    ['counterpartyWalletURL', message.params.counterpartyWalletURL],
    ['counterpartyWalletName', message.params.counterpartyWalletName],
    ['counterpartyWalletIcon', message.params.counterpartyWalletIcon],
    ['requestId', message.id],
  ];

  if (message.params.bitcoinContractOffer.includes('Invalid state: Not enough fund in utxos')) {
    chrome.tabs.sendMessage(
      getTabIdFromPort(port),
      makeRpcErrorResponse('acceptBitcoinContractOffer', {
        id: message.id,
        error: {
          code: RpcErrorCode.INVALID_REQUEST,
          message: 'The counterparty does not have enough funds to complete the offer',
        },
      })
    );
    return;
  }

  const { urlParams, tabId } = makeSearchParamsWithDefaults(port, params);

  const { id } = await triggerRequestWindowOpen(
    RouteUrls.RpcReceiveBitcoinContractOffer,
    urlParams
  );

  listenForPopupClose({
    tabId,
    id,
    response: makeRpcErrorResponse('acceptBitcoinContractOffer', {
      id: message.id,
      error: {
        code: RpcErrorCode.USER_REJECTION,
        message: 'User rejected the offer',
      },
    }),
  });
}
