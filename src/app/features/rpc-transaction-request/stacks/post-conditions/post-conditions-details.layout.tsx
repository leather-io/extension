import {
  PostConditionMode,
  type PostConditionModeName,
  type PostConditionWire,
} from '@stacks/transactions';

import { ensurePostConditionWireFormat } from '@leather.io/stacks';
import { Approver } from '@leather.io/ui';

import { NoPostConditions } from './no-post-conditions';
import { PostConditionList } from './post-condition-list';
import { PostConditionModeWarning } from './post-condition-mode-warning';

interface PostConditionsDetailsLayoutProps {
  postConditions: PostConditionWire[];
  postConditionMode?: PostConditionMode | PostConditionModeName;
}
export function PostConditionsDetailsLayout({
  postConditions,
  postConditionMode = PostConditionMode.Deny,
}: PostConditionsDetailsLayoutProps) {
  if (postConditionMode === PostConditionMode.Allow || postConditionMode === 'allow')
    return <PostConditionModeWarning />;

  return (
    <Approver.Section>
      <Approver.Subheader>Post conditions</Approver.Subheader>
      {postConditions.length ? (
        <PostConditionList
          postConditions={postConditions.map(pc => ensurePostConditionWireFormat(pc))}
        />
      ) : (
        <NoPostConditions />
      )}
    </Approver.Section>
  );
}
