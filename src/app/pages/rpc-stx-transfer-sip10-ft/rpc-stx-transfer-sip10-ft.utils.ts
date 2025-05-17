import type { StacksNetwork } from '@stacks/network';
import {
  type ClarityValue,
  createAddress,
  noneCV,
  postConditionToWire,
  serializeCV,
  serializePostConditionWire,
  standardPrincipalCVFromAddress,
  uintCV,
} from '@stacks/transactions';

import type { Money } from '@leather.io/models';
import { createRequestEncoder, stxTransferSip10Ft } from '@leather.io/rpc';
import {
  type StacksUnsignedContractCallOptions,
  TransactionTypes,
  getStacksAssetStringParts,
} from '@leather.io/stacks';
import { createMoney } from '@leather.io/utils';

import { getAddressFromAssetString } from '@shared/utils';
import { makeFtPostCondition } from '@shared/utils/post-conditions';

import { initialSearchParams } from '@app/common/initial-search-params';
import type { Nonce } from '@app/features/nonce-editor/nonce-editor.context';

export function getDecodedRpcStxTransferSip10FtRequest() {
  const { decode } = createRequestEncoder(stxTransferSip10Ft.request);
  const rpcRequest = initialSearchParams.get('rpcRequest');
  if (!rpcRequest) throw new Error('Missing rpcRequest');
  return decode(rpcRequest);
}

function getTransactionOptionsFromRpcRequest(address: string) {
  const decodedRpcRequest = getDecodedRpcStxTransferSip10FtRequest();

  const { contractAddress, contractAssetName, contractName } = getStacksAssetStringParts(
    decodedRpcRequest.params.asset
  );

  const fnArgs: ClarityValue[] = [
    uintCV(decodedRpcRequest.params.amount),
    standardPrincipalCVFromAddress(createAddress(decodedRpcRequest.params.address ?? address)),
    standardPrincipalCVFromAddress(createAddress(decodedRpcRequest.params.recipient)),
    noneCV(),
  ];
  const postConditionOptions = {
    amount: decodedRpcRequest.params.amount,
    contractAddress,
    contractAssetName,
    contractName,
    stxAddress: decodedRpcRequest.params.address ?? address,
  };

  return {
    contractAddress: getAddressFromAssetString(decodedRpcRequest.params.asset),
    contractName,
    functionArgs: fnArgs.map(arg => serializeCV(arg)),
    fee: decodedRpcRequest.params.fee
      ? createMoney(decodedRpcRequest.params.fee, 'STX')
      : undefined,
    nonce: decodedRpcRequest.params.nonce,
    sponsored: decodedRpcRequest.params.sponsored,
    postConditions: [
      serializePostConditionWire(postConditionToWire(makeFtPostCondition(postConditionOptions))),
    ],
  };
}

interface GetUnsignedStacksContractCallOptionsForFeeEstimationArgs {
  address: string;
  publicKey: string;
  network: StacksNetwork;
}
export function getUnsignedStacksContractCallOptionsForFeeEstimation({
  address,
  publicKey,
  network,
}: GetUnsignedStacksContractCallOptionsForFeeEstimationArgs): StacksUnsignedContractCallOptions {
  const requestOptions = getTransactionOptionsFromRpcRequest(address);

  return {
    txType: TransactionTypes.ContractCall,
    ...requestOptions,
    functionName: 'transfer',
    fee: requestOptions.fee ?? createMoney(0, 'STX'),
    nonce: requestOptions.nonce ?? 0,
    publicKey,
    network,
  };
}

interface GetUnsignedStacksContractCallOptionsArgs {
  address: string;
  fee: Money;
  network: StacksNetwork;
  nonce: Nonce;
  publicKey: string;
}
export function getUnsignedStacksContractCallOptions({
  address,
  fee,
  network,
  nonce,
  publicKey,
}: GetUnsignedStacksContractCallOptionsArgs): StacksUnsignedContractCallOptions {
  const requestOptions = getTransactionOptionsFromRpcRequest(address);

  return {
    txType: TransactionTypes.ContractCall,
    ...requestOptions,
    functionName: 'transfer',
    publicKey,
    network,
    fee,
    nonce,
  };
}
