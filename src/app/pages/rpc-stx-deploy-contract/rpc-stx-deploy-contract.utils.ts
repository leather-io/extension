import type { StacksNetwork } from '@stacks/network';
import { ClarityVersion, PostConditionMode } from '@stacks/transactions';

import type { Money } from '@leather.io/models';
import { createRequestEncoder, stxDeployContract } from '@leather.io/rpc';
import {
  type StacksUnsignedContractDeployOptions,
  TransactionTypes,
  ensurePostConditionWireFormat,
  getPostConditions,
} from '@leather.io/stacks';
import { createMoney } from '@leather.io/utils';

import { initialSearchParams } from '@app/common/initial-search-params';
import type { Nonce } from '@app/features/nonce-editor/nonce-editor.context';

export function getDecodedRpcStxDeployContractRequest() {
  const { decode } = createRequestEncoder(stxDeployContract.request);
  const rpcRequest = initialSearchParams.get('rpcRequest');
  if (!rpcRequest) throw new Error('Missing rpcRequest');
  return decode(rpcRequest);
}

export type RpcStxDeployContractRequest = ReturnType<typeof getDecodedRpcStxDeployContractRequest>;

function getTransactionOptionsFromRpcRequest() {
  const decodedRpcRequest = getDecodedRpcStxDeployContractRequest();
  return {
    contractName: decodedRpcRequest.params.name,
    codeBody: decodedRpcRequest.params.clarityCode,
    clarityVersion: decodedRpcRequest.params.clarityVersion ?? ClarityVersion.Clarity3,
    sponsored: decodedRpcRequest.params.sponsored,
    fee: decodedRpcRequest.params.fee
      ? createMoney(decodedRpcRequest.params.fee, 'STX')
      : undefined,
    nonce: decodedRpcRequest.params.nonce,
    postConditionMode:
      decodedRpcRequest.params.postConditionMode === 'allow'
        ? PostConditionMode.Allow
        : PostConditionMode.Deny,
    postConditions: getPostConditions(
      decodedRpcRequest.params.postConditions?.map(pc => ensurePostConditionWireFormat(pc))
    ),
  };
}

interface GetUnsignedStacksDeployContractOptionsForFeeEstimationArgs {
  publicKey: string;
  network: StacksNetwork;
}
export function getUnsignedStacksDeployContractOptionsForFeeEstimation({
  publicKey,
  network,
}: GetUnsignedStacksDeployContractOptionsForFeeEstimationArgs): StacksUnsignedContractDeployOptions {
  const requestOptions = getTransactionOptionsFromRpcRequest();

  return {
    txType: TransactionTypes.ContractDeploy,
    ...requestOptions,
    fee: requestOptions.fee ?? createMoney(0, 'STX'),
    nonce: requestOptions.nonce ?? 0,
    publicKey,
    network,
  };
}

interface GetUnsignedStacksDeployContractOptionsArgs {
  fee: Money;
  network: StacksNetwork;
  nonce: Nonce;
  publicKey: string;
}
export function getUnsignedStacksDeployContractOptions({
  fee,
  network,
  nonce,
  publicKey,
}: GetUnsignedStacksDeployContractOptionsArgs): StacksUnsignedContractDeployOptions {
  const requestOptions = getTransactionOptionsFromRpcRequest();

  return {
    txType: TransactionTypes.ContractDeploy,
    ...requestOptions,
    publicKey,
    network,
    fee,
    nonce,
  };
}
