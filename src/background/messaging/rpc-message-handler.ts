import {
  RpcEndpointMap,
  RpcErrorCode,
  type RpcRequests,
  createRpcErrorResponse,
} from '@leather.io/rpc';

import { logger } from '@shared/logger';

import { getAddressesHandler, stxGetAddressesHandler } from './rpc-methods/get-addresses';
import { openHandler } from './rpc-methods/open';
import { openSwapHandler } from './rpc-methods/open-swap';
import { sendTransferHandler } from './rpc-methods/send-transfer';
import { signMessageHandler } from './rpc-methods/sign-message';
import { signPsbtHandler } from './rpc-methods/sign-psbt';
import {
  stxSignMessageHandler,
  stxSignStructuredMessageHandler,
} from './rpc-methods/sign-stacks-message';
import { stxCallContractHandler } from './rpc-methods/stx-call-contract';
import { stxDeployContractHandler } from './rpc-methods/stx-deploy-contract';
import { stxSignTransactionHandler } from './rpc-methods/stx-sign-transaction';
import { stxTransferSip9NftHandler } from './rpc-methods/stx-transfer-sip9-nft';
import { stxTransferSip10FtHandler } from './rpc-methods/stx-transfer-sip10-ft';
import { stxTransferStxHandler } from './rpc-methods/stx-transfer-stx';
import { supportedMethodsHandler } from './rpc-methods/supported-methods';
import {
  createRpcResponder,
  listenAndForwardRpcRequest,
  listenForOriginTabClose,
} from './rpc-request-utils';

type RpcResponseSender = (response: any) => void;

type RpcHandler<T> = (
  request: T,
  sender: chrome.runtime.MessageSender,
  sendResponse: RpcResponseSender
) => Promise<void> | void;

type RpcHandlers = {
  [Method in keyof RpcEndpointMap]: RpcHandler<RpcEndpointMap[Method]['request']>;
};

const rpcHandlers: Partial<RpcHandlers> = {};

function registerRpcRequestHandler<M extends RpcRequests['method']>(
  method: M,
  handler: RpcHandler<RpcEndpointMap[M]['request']>
) {
  rpcHandlers[method] = handler;
}

export function defineRpcRequestHandler<M extends RpcRequests['method']>(
  method: M,
  handler: RpcHandler<RpcEndpointMap[M]['request']>
) {
  return [method, handler] as const;
}

export async function rpcMessageHandler(
  request: RpcRequests,
  sender: chrome.runtime.MessageSender
) {
  listenForOriginTabClose({ tabId: sender?.tab?.id });

  logger.info(`Received RPC request ${request.method}`, request);

  // This typecast safely bypasses the compiler since it cannot infer or narrow
  // the type to know the `request` being passed to `handler` is the correct
  // one. Type safety is guaranteed by `registerRpcRequestHandler`
  const handler = rpcHandlers[request.method] as RpcHandler<any>;

  const sendMessage = createRpcResponder(sender);

  if (handler) {
    listenAndForwardRpcRequest(request.id, sendMessage);
    return await handler(request, sender, sendMessage);
  }

  sendMessage(
    createRpcErrorResponse(request.method, {
      id: request.id,
      error: {
        code: RpcErrorCode.METHOD_NOT_FOUND,
        message: `"${request.method}" is not supported. Try running \`.request('supportedMethods')\` to see what Leather can do, or check out our developer documentation at https://leather.gitbook.io/developers/home/welcome`,
      },
    })
  );
}

registerRpcRequestHandler(...getAddressesHandler);
registerRpcRequestHandler(...openHandler);
registerRpcRequestHandler(...openSwapHandler);
registerRpcRequestHandler(...sendTransferHandler);
registerRpcRequestHandler(...signMessageHandler);
registerRpcRequestHandler(...signPsbtHandler);
registerRpcRequestHandler(...stxCallContractHandler);
registerRpcRequestHandler(...stxDeployContractHandler);
registerRpcRequestHandler(...stxGetAddressesHandler);
registerRpcRequestHandler(...stxSignMessageHandler);
registerRpcRequestHandler(...stxSignStructuredMessageHandler);
registerRpcRequestHandler(...stxSignTransactionHandler);
registerRpcRequestHandler(...stxTransferSip9NftHandler);
registerRpcRequestHandler(...stxTransferSip10FtHandler);
registerRpcRequestHandler(...stxTransferStxHandler);
registerRpcRequestHandler(...supportedMethodsHandler);
