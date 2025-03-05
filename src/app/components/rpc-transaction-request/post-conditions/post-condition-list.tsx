import { PostConditionType, type PostConditionWire } from '@stacks/transactions';

import type { StacksUnsignedTransactionOptions } from '@leather.io/stacks';

import { FungiblePostConditionItem } from './fungible-post-condition-item';
import { PostConditionItem } from './post-condition-item';
import { checkIsContractPrincipal } from './post-conditions.utils';

interface PostConditionListProps {
  postConditions: PostConditionWire[];
  txOptions: StacksUnsignedTransactionOptions;
}
// TODO: Refactor post conditions
//
// This code has, for the most part, simply been relocated and isolated from existing code
// that handles post conditions for legacy tx requests. The intention here is to first isolate
// the code, then refactor it for Approver UX with new tests.
export function PostConditionList({ postConditions, txOptions }: PostConditionListProps) {
  return postConditions.map((pc, index) => {
    if (pc.conditionType === PostConditionType.Fungible) {
      return (
        <FungiblePostConditionItem
          key={`${pc.type}-${pc.conditionCode}`}
          isContractPrincipal={checkIsContractPrincipal(pc, txOptions)}
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
          isContractPrincipal={checkIsContractPrincipal(pc, txOptions)}
          isLast={index === postConditions.length - 1}
          postCondition={pc}
        />
      );
    }
    return;
  });
}
