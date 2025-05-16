import {
  AddressHashMode,
  StacksTransactionWire,
  deserializeTransaction,
} from '@stacks/transactions';

import { type RpcParams, createRequestEncoder, stxSignTransaction } from '@leather.io/rpc';
import { isDefined } from '@leather.io/utils';

import { initialSearchParams } from '@app/common/initial-search-params';

function getStacksTransactionHexFromRequest(requestParams: RpcParams<typeof stxSignTransaction>) {
  if ('txHex' in requestParams) return requestParams.txHex;
  return requestParams.transaction;
}

function getDecodedRpcStxSignTransactionRequest() {
  const { decode } = createRequestEncoder(stxSignTransaction.request);
  const rpcRequest = initialSearchParams.get('rpcRequest');
  if (!rpcRequest) throw new Error('Missing rpcRequest');
  return decode(rpcRequest);
}

export function getUnsignedStacksTransactionFromRpcRequest() {
  const decodedRpcRequest = getDecodedRpcStxSignTransactionRequest();
  return deserializeTransaction(getStacksTransactionHexFromRequest(decodedRpcRequest.params));
}

export function checkUnsignedStacksTransactionHashMode(tx: StacksTransactionWire) {
  const hashMode = tx.auth.spendingCondition.hashMode;
  return (
    hashMode === AddressHashMode.P2SH ||
    hashMode === AddressHashMode.P2WSH ||
    hashMode === AddressHashMode.P2SHNonSequential ||
    hashMode === AddressHashMode.P2WSHNonSequential
  );
}

export function checkUnsignedStacksTransactionFee(tx: StacksTransactionWire) {
  const txFee = tx.auth.spendingCondition.fee;
  return isDefined(txFee) && !Number.isNaN(txFee);
}

export function checkUnsignedStacksTransactionNonce(tx: StacksTransactionWire) {
  const txNonce = tx.auth.spendingCondition.nonce;
  return isDefined(txNonce) && !Number.isNaN(txNonce);
}
