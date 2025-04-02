import { isSupportedMessageSigningPaymentType } from '@leather.io/bitcoin';
import {
  type PaymentTypes,
  RpcErrorCode,
  createRpcErrorResponse,
  signMessage,
} from '@leather.io/rpc';
import { isDefined, isUndefined } from '@leather.io/utils';

import { RouteUrls } from '@shared/route-urls';
import {
  getRpcSignMessageParamErrors,
  validateRpcSignMessageParams,
} from '@shared/rpc/methods/sign-message';

import { trackRpcRequestError, trackRpcRequestSuccess } from '../rpc-helpers';
import { defineRpcRequestHandler } from '../rpc-message-handler';
import {
  RequestParams,
  getTabIdFromPort,
  listenForPopupClose,
  makeSearchParamsWithDefaults,
  triggerRequestPopupWindowOpen,
} from '../rpc-request-utils';

export const signMessageHandler = defineRpcRequestHandler(
  signMessage.method,
  async (request, port) => {
    if (isUndefined(request.params)) {
      void trackRpcRequestError({ endpoint: 'signMessage', error: 'Undefined parameters' });
      chrome.tabs.sendMessage(
        getTabIdFromPort(port),
        createRpcErrorResponse('signMessage', {
          id: request.id,
          error: { code: RpcErrorCode.INVALID_REQUEST, message: 'Parameters undefined' },
        })
      );
      return;
    }

    if (!validateRpcSignMessageParams(request.params)) {
      void trackRpcRequestError({ endpoint: 'signMessage', error: 'Invalid parameters' });

      chrome.tabs.sendMessage(
        getTabIdFromPort(port),
        createRpcErrorResponse('signMessage', {
          id: request.id,
          error: {
            code: RpcErrorCode.INVALID_PARAMS,
            message: getRpcSignMessageParamErrors(request.params),
          },
        })
      );
      return;
    }

    const paymentType: Extract<'p2tr' | 'p2wpkh', PaymentTypes> =
      (request.params as any).paymentType ?? 'p2wpkh';

    if (!isSupportedMessageSigningPaymentType(paymentType)) {
      void trackRpcRequestError({ endpoint: 'signMessage', error: 'Unsupported payment type' });

      chrome.tabs.sendMessage(
        getTabIdFromPort(port),
        createRpcErrorResponse('signMessage', {
          id: request.id,
          error: {
            code: RpcErrorCode.INVALID_PARAMS,
            message:
              'Unsupported payment type. Leather only supports signing messages for Native Segwit (p2wpkh) and Taproot (p2tr) addresses.',
          },
        })
      );
      return;
    }

    void trackRpcRequestSuccess({ endpoint: request.method });

    const requestParams: RequestParams = [
      ['message', request.params.message],
      ['network', (request.params as any).network ?? 'mainnet'],
      ['paymentType', paymentType],
      ['requestId', request.id],
    ];

    if (isDefined((request.params as any).account)) {
      requestParams.push(['accountIndex', (request.params as any).account.toString()]);
    }

    const { urlParams, tabId } = makeSearchParamsWithDefaults(port, requestParams);
    const { id } = await triggerRequestPopupWindowOpen(RouteUrls.RpcSignBip322Message, urlParams);

    listenForPopupClose({
      tabId,
      id,
      response: createRpcErrorResponse('signMessage', {
        id: request.id,
        error: {
          code: RpcErrorCode.USER_REJECTION,
          message: 'User rejected the message signature',
        },
      }),
    });
  }
);
