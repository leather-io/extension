import type { StacksNetwork } from '@stacks/network';

import type { Money } from '@leather.io/models';
import { createRequestEncoder, stxTransferStx } from '@leather.io/rpc';
import { type StacksUnsignedTokenTransferOptions, TransactionTypes } from '@leather.io/stacks';
import { createMoney } from '@leather.io/utils';

import { initialSearchParams } from '@app/common/initial-search-params';
import type { Nonce } from '@app/features/nonce-editor/nonce-editor.context';

export function getDecodedRpcStxTransferStxRequest() {
  const { decode } = createRequestEncoder(stxTransferStx.request);
  const rpcRequest = initialSearchParams.get('rpcRequest');
  if (!rpcRequest) throw new Error('Missing rpcRequest');
  return decode(rpcRequest);
}

function getTransactionOptionsFromRpcRequest() {
  const decodedRpcRequest = getDecodedRpcStxTransferStxRequest();
  return {
    amount: createMoney(decodedRpcRequest.params.amount, 'STX'),
    memo: decodedRpcRequest.params.memo,
    recipient: decodedRpcRequest.params.recipient,
    sponsored: decodedRpcRequest.params.sponsored,
    fee: decodedRpcRequest.params.fee
      ? createMoney(decodedRpcRequest.params.fee, 'STX')
      : undefined,
    nonce: decodedRpcRequest.params.nonce,
  };
}

interface GetUnsignedStacksTokenTransferOptionsForFeeEstimationArgs {
  publicKey: string;
  network: StacksNetwork;
}
export function getUnsignedStacksTokenTransferOptionsForFeeEstimation({
  publicKey,
  network,
}: GetUnsignedStacksTokenTransferOptionsForFeeEstimationArgs): StacksUnsignedTokenTransferOptions {
  const requestOptions = getTransactionOptionsFromRpcRequest();

  return {
    txType: TransactionTypes.StxTokenTransfer,
    ...requestOptions,
    fee: requestOptions.fee ?? createMoney(0, 'STX'),
    nonce: requestOptions.nonce ?? 0,
    publicKey,
    network,
  };
}

interface GetUnsignedStacksTokenTransferOptionsArgs {
  fee: Money;
  network: StacksNetwork;
  nonce: Nonce;
  publicKey: string;
}
export function getUnsignedStacksTokenTransferOptions({
  fee,
  network,
  nonce,
  publicKey,
}: GetUnsignedStacksTokenTransferOptionsArgs): StacksUnsignedTokenTransferOptions {
  const requestOptions = getTransactionOptionsFromRpcRequest();

  return {
    txType: TransactionTypes.StxTokenTransfer,
    ...requestOptions,
    publicKey,
    network,
    fee,
    nonce,
  };
}
