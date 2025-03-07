import { useAsync } from 'react-async-hook';

import { PostConditionMode } from '@stacks/transactions';

import { useNextNonce } from '@leather.io/query';
import { createRequestEncoder, stxCallContract } from '@leather.io/rpc';
import {
  type StacksUnsignedContractCallOptions,
  TransactionTypes,
  ensurePostConditionWireFormat,
  generateStacksUnsignedTransaction,
  getPostConditions,
  getStacksContractName,
} from '@leather.io/stacks';
import { createMoney, isUndefined } from '@leather.io/utils';

import { initialSearchParams } from '@app/common/initial-search-params';
import { useCurrentStacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { useCurrentStacksNetworkState } from '@app/store/networks/networks.hooks';

const { decode } = createRequestEncoder(stxCallContract.request);

function useCallContractRequest() {
  const request = initialSearchParams.get('rpcRequest');
  if (!request) throw new Error('Missing rpcRequest');
  return { request: decode(request) };
}

export function useRpcStxCallContract() {
  const { request } = useCallContractRequest();
  const account = useCurrentStacksAccount();
  const { data: nextNonce } = useNextNonce(account?.address ?? '');
  const network = useCurrentStacksNetworkState();

  const unsignedTx = useAsync(async () => {
    if (isUndefined(account) || isUndefined(nextNonce)) return;

    const options: StacksUnsignedContractCallOptions = {
      txType: TransactionTypes.ContractCall,
      publicKey: account.stxPublicKey,
      contractName: getStacksContractName(request.params.contract),
      contractAddress: request.params.contract.split('.')[0],
      fee: createMoney(request.params.fee ?? 0, 'STX'),
      functionArgs: request.params.functionArgs ?? [],
      functionName: request.params.functionName,
      network,
      nonce: request.params.nonce ?? nextNonce.nonce ?? '',
      postConditions: getPostConditions(
        request.params.postConditions?.map(pc => ensurePostConditionWireFormat(pc))
      ),
      postConditionMode: request.params.postConditionMode ?? PostConditionMode.Deny,
      sponsored: request.params.sponsored ?? false,
    };

    return generateStacksUnsignedTransaction(options);
  }, [account, network, nextNonce]).result;

  return {
    unsignedTx,
  };
}
