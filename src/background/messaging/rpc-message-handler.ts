import {
  type LeatherRpcMethodMap,
  RpcErrorCode,
  type RpcRequests,
  createRpcErrorResponse,
} from '@leather.io/rpc';

import { getTabIdFromPort, listenForOriginTabClose } from './messaging-utils';
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

type RpcHandler<T> = (request: T, port: chrome.runtime.Port) => Promise<void> | void;

type RpcHandlers = {
  [Method in keyof LeatherRpcMethodMap]: RpcHandler<LeatherRpcMethodMap[Method]['request']>;
};

const rpcHandlers: Partial<RpcHandlers> = {};

function registerRpcRequestHandler<M extends RpcRequests['method']>(
  method: M,
  handler: RpcHandler<LeatherRpcMethodMap[M]['request']>
) {
  rpcHandlers[method] = handler;
}

export function defineRpcRequestHandler<M extends RpcRequests['method']>(
  method: M,
  handler: RpcHandler<LeatherRpcMethodMap[M]['request']>
) {
  return [method, handler] as const;
}

export async function rpcMessageHandler(request: RpcRequests, port: chrome.runtime.Port) {
  listenForOriginTabClose({ tabId: port.sender?.tab?.id });

  // This typecast safely bypasses the compiler since it cannot infer or narrow
  // the type to know the `request` being passed to `handler` is the correct
  // one. Type safety is guaranteed by `registerRpcRequestHandler`
  const handler = rpcHandlers[request.method] as RpcHandler<any>;

  if (handler) return await handler(request, port);

  chrome.tabs.sendMessage(
    getTabIdFromPort(port),
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
registerRpcRequestHandler(...stxTransferSip10FtHandler);
registerRpcRequestHandler(...stxTransferSip9NftHandler);
registerRpcRequestHandler(...stxTransferStxHandler);
registerRpcRequestHandler(...supportedMethodsHandler);
