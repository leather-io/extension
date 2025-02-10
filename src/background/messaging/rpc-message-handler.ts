import {
  RpcErrorCode,
  type RpcRequests,
  createRpcErrorResponse,
  getAddresses,
  open,
  openSwap,
  stxCallContract,
  stxDeployContract,
  stxGetAddresses,
  stxSignMessage,
  stxSignStructuredMessage,
  stxSignTransaction,
  supportedMethods,
} from '@leather.io/rpc';

import { queueAnalyticsRequest } from '@background/background-analytics';
import { rpcSwap } from '@background/messaging/rpc-methods/open-swap';
import { rpcSignStacksTransaction } from '@background/messaging/rpc-methods/sign-stacks-transaction';

import { getTabIdFromPort, listenForOriginTabClose } from './messaging-utils';
import { rpcGetAddresses } from './rpc-methods/get-addresses';
import { rpcOpen } from './rpc-methods/open';
import { rpcSendTransfer } from './rpc-methods/send-transfer';
import { rpcSignMessage } from './rpc-methods/sign-message';
import { rpcSignPsbt } from './rpc-methods/sign-psbt';
import {
  rpcSignStacksMessage,
  rpcSignStacksStructuredMessage,
} from './rpc-methods/sign-stacks-message';
import { rpcStxCallContract } from './rpc-methods/stx-call-contract';
import { rpcStxDeployContract } from './rpc-methods/stx-deploy-contract';
import { rpcStxGetAddresses } from './rpc-methods/stx-get-addresses';
import { rpcSupportedMethods } from './rpc-methods/supported-methods';

export async function rpcMessageHandler(message: RpcRequests, port: chrome.runtime.Port) {
  listenForOriginTabClose({ tabId: port.sender?.tab?.id });

  switch (message.method) {
    case open.method: {
      await rpcOpen(message, port);
      break;
    }
    case openSwap.method: {
      await rpcSwap(message, port);
      break;
    }
    case getAddresses.method: {
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

    case stxCallContract.method: {
      await rpcStxCallContract(message, port);
      break;
    }

    case stxDeployContract.method: {
      await rpcStxDeployContract(message, port);
      break;
    }

    case stxSignTransaction.method: {
      await rpcSignStacksTransaction(message, port);
      break;
    }

    case supportedMethods.method: {
      rpcSupportedMethods(message, port);
      break;
    }

    case stxSignMessage.method: {
      await rpcSignStacksMessage(message, port);
      break;
    }

    case stxSignStructuredMessage.method: {
      await rpcSignStacksStructuredMessage(message, port);
      break;
    }

    case stxGetAddresses.method: {
      await rpcStxGetAddresses(message, port);
      break;
    }

    default:
      chrome.tabs.sendMessage(
        getTabIdFromPort(port),
        createRpcErrorResponse(message.method, {
          id: message.id,
          error: {
            code: RpcErrorCode.METHOD_NOT_FOUND,
            message: `"${message.method}" is not supported. Try running \`.request('supportedMethods')\` to see what Leather can do, or check out our developer documentation at https://leather.gitbook.io/developers/home/welcome`,
          },
        })
      );
      break;
  }
}

interface TrackRpcRequestSuccess {
  endpoint: RpcRequests['method'];
}
export async function trackRpcRequestSuccess(args: TrackRpcRequestSuccess) {
  return queueAnalyticsRequest('rpc_request_successful', { ...args });
}

interface TrackRpcRequestError {
  endpoint: RpcRequests['method'];
  error: string;
}
export async function trackRpcRequestError(args: TrackRpcRequestError) {
  return queueAnalyticsRequest('rpc_request_error', { ...args });
}
