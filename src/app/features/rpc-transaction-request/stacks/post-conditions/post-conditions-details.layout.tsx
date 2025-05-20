import { PostConditionMode } from '@stacks/transactions';
import { styled } from 'leather-styles/jsx';

import {
  type StacksUnsignedTransactionOptions,
  ensurePostConditionWireFormat,
} from '@leather.io/stacks';
import { Approver } from '@leather.io/ui';

import { NoPostConditions } from './no-post-conditions';
import { PostConditionList } from './post-condition-list';
import { PostConditionModeWarning } from './post-condition-mode-warning';

interface PostConditionsDetailsLayoutProps {
  txOptions: StacksUnsignedTransactionOptions;
}
export function PostConditionsDetailsLayout({ txOptions }: PostConditionsDetailsLayoutProps) {
  if ('postConditionMode' in txOptions && txOptions.postConditionMode === PostConditionMode.Allow)
    return <PostConditionModeWarning />;

  return (
    <Approver.Section>
      <Approver.Subheader>
        <styled.span textStyle="label.01">Post conditions</styled.span>
      </Approver.Subheader>
      {'postConditions' in txOptions && txOptions.postConditions?.length ? (
        <PostConditionList
          postConditions={txOptions.postConditions.map(pc => ensurePostConditionWireFormat(pc))}
          txOptions={txOptions}
        />
      ) : (
        <NoPostConditions />
      )}
    </Approver.Section>
  );
}
