import { PostConditionMode } from '@stacks/transactions';
import { styled } from 'leather-styles/jsx';

import { ensurePostConditionWireFormat } from '@leather.io/stacks';
import { Approver } from '@leather.io/ui';

import { NoPostConditions } from '@app/components/rpc-transaction-request/post-conditions/no-post-conditions';
import { PostConditionList } from '@app/components/rpc-transaction-request/post-conditions/post-condition-list';
import { PostConditionModeWarning } from '@app/components/rpc-transaction-request/post-conditions/post-condition-mode-warning';
import {
  type RpcCallContractRequestContext,
  useRpcTransactionRequestContext,
} from '@app/features/rpc-transaction-request/rpc-transaction-request.context';

export function PostConditionsDetailsLayout() {
  const { rpcRequest } = useRpcTransactionRequestContext<RpcCallContractRequestContext>();

  if (rpcRequest.txOptions.postConditionMode === PostConditionMode.Allow)
    return <PostConditionModeWarning />;

  return (
    <Approver.Section>
      <Approver.Subheader>
        <styled.span textStyle="label.01">Post conditions</styled.span>
      </Approver.Subheader>
      {rpcRequest.txOptions.postConditions?.length ? (
        <PostConditionList
          postConditions={rpcRequest.txOptions.postConditions.map(pc =>
            ensurePostConditionWireFormat(pc)
          )}
          txOptions={rpcRequest.txOptions}
        />
      ) : (
        <NoPostConditions />
      )}
    </Approver.Section>
  );
}
