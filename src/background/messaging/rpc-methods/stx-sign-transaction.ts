import {
  AddressHashMode,
  AuthType,
  MultiSigHashMode,
  PayloadType,
  StacksTransactionWire,
  VersionedSmartContractPayloadWire,
  addressToString,
  cvToValue,
  deserializeTransaction,
  serializeCV,
} from '@stacks/transactions';
import { createUnsecuredToken } from 'jsontokens';

import {
  RpcErrorCode,
  type RpcParams,
  createRpcErrorResponse,
  stxSignTransaction,
} from '@leather.io/rpc';
import { TransactionTypes } from '@leather.io/stacks';
import { isDefined, isUndefined } from '@leather.io/utils';

import { RouteUrls } from '@shared/route-urls';
import {
  getRpcSignStacksTransactionParamErrors,
  validateRpcSignStacksTransactionParams,
} from '@shared/rpc/methods/sign-stacks-transaction';

import { trackRpcRequestError, trackRpcRequestSuccess } from '../rpc-helpers';
import { defineRpcRequestHandler } from '../rpc-message-handler';
import {
  RequestParams,
  encodePostConditions,
  getTabIdFromPort,
  makeSearchParamsWithDefaults,
  sendErrorResponseOnUserPopupClose,
  triggerRequestPopupWindowOpen,
} from '../rpc-request-utils';

const MEMO_DESERIALIZATION_STUB = '\u0000';

function cleanMemoString(memo: string): string {
  return memo.replaceAll(MEMO_DESERIALIZATION_STUB, '');
}

function getStacksTransactionHexFromRequest(requestParams: RpcParams<typeof stxSignTransaction>) {
  if ('txHex' in requestParams) return requestParams.txHex;
  return requestParams.transaction;
}

function getAccountAddressFromRequest(requestParams: RpcParams<typeof stxSignTransaction>) {
  if ('txHex' in requestParams) return requestParams.stxAddress;
  return;
}

function transactionPayloadToTransactionRequest(
  stacksTransaction: StacksTransactionWire,
  stxAddress?: string
) {
  const transactionRequest = {
    stxAddress,
    sponsored: stacksTransaction.auth.authType === AuthType.Sponsored,
    nonce: Number(stacksTransaction.auth.spendingCondition.nonce),
    fee: Number(stacksTransaction.auth.spendingCondition.fee),
    postConditions: encodePostConditions(stacksTransaction.postConditions.values as any[]),
    postConditionMode: stacksTransaction.postConditionMode,
    anchorMode: stacksTransaction.anchorMode,
  } as any;

  switch (stacksTransaction.payload.payloadType) {
    case PayloadType.TokenTransfer:
      transactionRequest.txType = TransactionTypes.StxTokenTransfer;
      transactionRequest.recipient = cvToValue(stacksTransaction.payload.recipient, true);
      transactionRequest.amount = stacksTransaction.payload.amount.toString();
      transactionRequest.memo = cleanMemoString(stacksTransaction.payload.memo.content);
      break;
    case PayloadType.ContractCall:
      transactionRequest.txType = TransactionTypes.ContractCall;
      transactionRequest.contractName = stacksTransaction.payload.contractName.content;
      transactionRequest.contractAddress = addressToString(
        stacksTransaction.payload.contractAddress
      );
      transactionRequest.functionArgs = stacksTransaction.payload.functionArgs.map(arg =>
        serializeCV(arg)
      );
      transactionRequest.functionName = stacksTransaction.payload.functionName.content;
      break;
    case PayloadType.SmartContract:
    case PayloadType.VersionedSmartContract:
      transactionRequest.txType = TransactionTypes.ContractDeploy;
      transactionRequest.contractName = stacksTransaction.payload.contractName.content;
      transactionRequest.codeBody = stacksTransaction.payload.codeBody.content;
      transactionRequest.clarityVersion = (
        stacksTransaction.payload as VersionedSmartContractPayloadWire
      ).clarityVersion;
      break;
    default:
      throw new Error('Unsupported tx type');
  }

  return transactionRequest;
}

function validateStacksTransaction(txHex: string) {
  try {
    deserializeTransaction(txHex);
    return true;
  } catch (e) {
    return false;
  }
}

export const stxSignTransactionHandler = defineRpcRequestHandler(
  stxSignTransaction.method,
  async (request, port) => {
    if (isUndefined(request.params)) {
      void trackRpcRequestError({ endpoint: request.method, error: 'Undefined parameters' });
      chrome.tabs.sendMessage(
        getTabIdFromPort(port),
        createRpcErrorResponse('stx_signTransaction', {
          id: request.id,
          error: { code: RpcErrorCode.INVALID_REQUEST, message: 'Parameters undefined' },
        })
      );
      return;
    }

    if (!validateRpcSignStacksTransactionParams(request.params)) {
      void trackRpcRequestError({ endpoint: request.method, error: 'Invalid parameters' });

      chrome.tabs.sendMessage(
        getTabIdFromPort(port),
        createRpcErrorResponse('stx_signTransaction', {
          id: request.id,
          error: {
            code: RpcErrorCode.INVALID_PARAMS,
            message: getRpcSignStacksTransactionParamErrors(request.params),
          },
        })
      );
      return;
    }

    if (!validateStacksTransaction(getStacksTransactionHexFromRequest(request.params))) {
      void trackRpcRequestError({ endpoint: request.method, error: 'Invalid Stacks transaction' });

      chrome.tabs.sendMessage(
        getTabIdFromPort(port),
        createRpcErrorResponse('stx_signTransaction', {
          id: request.id,
          error: { code: RpcErrorCode.INVALID_PARAMS, message: 'Invalid Stacks transaction hex' },
        })
      );
      return;
    }

    const stacksTransaction = deserializeTransaction(
      getStacksTransactionHexFromRequest(request.params)
    );
    const txRequest = transactionPayloadToTransactionRequest(
      stacksTransaction,
      getAccountAddressFromRequest(request.params)
    );

    const hashMode = stacksTransaction.auth.spendingCondition.hashMode as MultiSigHashMode;

    const isMultisig =
      hashMode === AddressHashMode.P2SH ||
      hashMode === AddressHashMode.P2WSH ||
      hashMode === AddressHashMode.P2SHNonSequential ||
      hashMode === AddressHashMode.P2WSHNonSequential;

    void trackRpcRequestSuccess({ endpoint: request.method });

    const requestParams = [
      ['txHex', getStacksTransactionHexFromRequest(request.params)],
      ['requestId', request.id],
      ['request', createUnsecuredToken(txRequest)],
      ['isMultisig', String(isMultisig)],
    ] satisfies RequestParams;

    if (isDefined(request.params.network)) requestParams.push(['network', request.params.network]);

    const { urlParams, tabId } = await makeSearchParamsWithDefaults(port, requestParams);

    const { id } = await triggerRequestPopupWindowOpen(RouteUrls.RpcStxSignTransaction, urlParams);
    sendErrorResponseOnUserPopupClose({ tabId, id, request });
  }
);
