import { RpcErrorCode } from '@btckit/types';

import { RouteUrls } from '@shared/route-urls';
import {
  BitcoinContractRequest,
  BitcoinContractResponseStatus,
} from '@shared/rpc/methods/accept-bitcoin-contract';
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
  if (
    !message.params ||
    !message.params.bitcoinContractOffer ||
    !message.params.bitcoinNetwork ||
    !message.params.counterpartyWalletDetails
  ) {
    chrome.tabs.sendMessage(
      getTabIdFromPort(port),
      makeRpcErrorResponse('acceptBitcoinContractOffer', {
        id: message.id,
        error: {
          code: RpcErrorCode.INVALID_PARAMS,
          message: 'The provided parameters are not valid.',
        },
      })
    );
    return;
  }

  const params: RequestParams = [
    ['bitcoinContractOffer', message.params.bitcoinContractOffer],
    ['bitcoinNetwork', message.params.bitcoinNetwork],
    ['counterpartyWalletDetails', message.params.counterpartyWalletDetails],
    ['requestId', message.id],
  ];

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
        message: BitcoinContractResponseStatus.REJECTED,
      },
    }),
  });
}
