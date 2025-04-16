import type { StacksNetwork } from '@stacks/network';

import { createRequestEncoder, stxTransferStx } from '@leather.io/rpc';
import { type StacksUnsignedTokenTransferOptions, TransactionTypes } from '@leather.io/stacks';
import { createMoney } from '@leather.io/utils';

import { initialSearchParams } from '@app/common/initial-search-params';

const { decode } = createRequestEncoder(stxTransferStx.request);

interface GetStacksUnsignedTokenTransferOptionsFromRequestArgs {
  publicKey: string;
  network: StacksNetwork;
}
export function getStacksUnsignedTokenTransferOptionsFromRequest({
  publicKey,
  network,
}: GetStacksUnsignedTokenTransferOptionsFromRequestArgs): StacksUnsignedTokenTransferOptions {
  const rpcRequest = initialSearchParams.get('rpcRequest');
  if (!rpcRequest) throw new Error('Missing rpcRequest');
  const decodedRpcRequest = decode(rpcRequest);

  return {
    txType: TransactionTypes.StxTokenTransfer,
    amount: createMoney(decodedRpcRequest.params.amount, 'STX'),
    fee: createMoney(decodedRpcRequest.params.fee ?? 0, 'STX'),
    memo: decodedRpcRequest.params.memo ?? '',
    recipient: decodedRpcRequest.params.recipient,
    nonce: decodedRpcRequest.params.nonce ?? 0,
    sponsored: decodedRpcRequest.params.sponsored ?? false,
    publicKey,
    network,
  };
}
