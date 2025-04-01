import { PostConditionType } from '@stacks/transactions';

import { useTransactionPostConditions } from '@app/store/transactions/transaction.hooks';

import { FungiblePostConditionItem } from './fungible-post-condition-item';
import { PostConditionItem } from './post-condition-item';

export function PostConditionsList(): React.JSX.Element {
  const postConditions = useTransactionPostConditions();

  return (
    <>
      {postConditions?.map((pc, index) => {
        if (pc.conditionType === PostConditionType.Fungible) {
          return (
            <FungiblePostConditionItem
              pc={pc}
              isLast={index === postConditions.length - 1}
              key={`${pc.type}-${pc.conditionCode}`}
            />
          );
        }
        if (
          pc.conditionType === PostConditionType.STX ||
          pc.conditionType === PostConditionType.NonFungible
        ) {
          return (
            <PostConditionItem
              pc={pc}
              isLast={index === postConditions.length - 1}
              key={`${pc.type}-${pc.conditionCode}`}
            />
          );
        }
        return;
      })}
    </>
  );
}
