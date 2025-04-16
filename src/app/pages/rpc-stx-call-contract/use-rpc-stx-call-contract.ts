import { useMemo } from 'react';

import { PostConditionMode } from '@stacks/transactions';

import { createRequestEncoder, stxCallContract } from '@leather.io/rpc';
import {
  type StacksUnsignedContractCallOptions,
  TransactionTypes,
  ensurePostConditionWireFormat,
  getPostConditions,
  getStacksContractName,
} from '@leather.io/stacks';
import { createMoney } from '@leather.io/utils';

import { initialSearchParams } from '@app/common/initial-search-params';
import { useBreakOnNonCompliantEntity } from '@app/query/common/compliance-checker/compliance-checker.query';
import { useNextNonce } from '@app/query/stacks/nonce/account-nonces.hooks';
import { useCurrentStacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { useCurrentStacksNetworkState } from '@app/store/networks/networks.hooks';

const { decode } = createRequestEncoder(stxCallContract.request);

function useCallContractRequest() {
  const request = initialSearchParams.get('rpcRequest');
  if (!request) throw new Error('Missing rpcRequest');
  return { request: decode(request) };
}

export function useRpcStxCallContractTxOptions(): StacksUnsignedContractCallOptions {
  const { request } = useCallContractRequest();
  const account = useCurrentStacksAccount();
  const { data: nextNonce } = useNextNonce(account?.address ?? '');
  const network = useCurrentStacksNetworkState();

  useBreakOnNonCompliantEntity(request.params.address ?? account?.address);

  return useMemo(
    () => ({
      txType: TransactionTypes.ContractCall,
      contractName: getStacksContractName(request.params.contract),
      contractAddress: request.params.contract.split('.')[0],
      fee: createMoney(request.params.fee ?? 0, 'STX'),
      functionArgs: request.params.functionArgs ?? [],
      functionName: request.params.functionName,
      network,
      nonce: request.params.nonce ?? nextNonce?.nonce ?? '',
      postConditions: getPostConditions(
        request.params.postConditions?.map(pc => ensurePostConditionWireFormat(pc))
      ),
      postConditionMode:
        request.params.postConditionMode === 'allow'
          ? PostConditionMode.Allow
          : PostConditionMode.Deny,
      publicKey: account?.stxPublicKey || '',
      sponsored: request.params.sponsored ?? false,
    }),
    [account, network, nextNonce, request]
  );
}
