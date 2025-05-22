import {
  PostConditionPrincipalId,
  PostConditionType,
  type PostConditionWire,
} from '@stacks/transactions';
import { Stack } from 'leather-styles/jsx';

import { FungiblePostConditionItem } from './fungible-post-condition-item';
import { PostConditionItem } from './post-condition-item';

interface PostConditionListProps {
  postConditions: PostConditionWire[];
}
// TODO LEA-2439: Refactor post conditions
export function PostConditionList({ postConditions }: PostConditionListProps) {
  return (
    <Stack gap="space.04">
      {postConditions.map((pc, index) => {
        if (pc.conditionType === PostConditionType.Fungible) {
          return (
            <FungiblePostConditionItem
              key={`${pc.type}-${pc.conditionCode}`}
              isContractPrincipal={pc.principal.prefix === PostConditionPrincipalId.Contract}
              isLast={index === postConditions.length - 1}
              postCondition={pc}
            />
          );
        }
        if (
          pc.conditionType === PostConditionType.STX ||
          pc.conditionType === PostConditionType.NonFungible
        ) {
          return (
            <PostConditionItem
              key={`${pc.type}-${pc.conditionCode}`}
              isContractPrincipal={pc.principal.prefix === PostConditionPrincipalId.Contract}
              isLast={index === postConditions.length - 1}
              postCondition={pc}
            />
          );
        }
        return;
      })}
    </Stack>
  );
}
