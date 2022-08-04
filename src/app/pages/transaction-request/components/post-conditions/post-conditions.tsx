import { Suspense, useMemo } from 'react';
import { TransactionTypes } from '@stacks/connect';
import { color, Flex } from '@stacks/ui';
import { PostConditionMode } from '@stacks/transactions';

import { useTransactionRequestState } from '@app/store/transactions/requests.hooks';
import { useTransactionPostConditions } from '@app/store/transactions/transaction.hooks';
import { usePostConditionModeState } from '@app/store/transactions/post-conditions.hooks';
import { IS_TEST_ENV } from '@shared/environment';

import { StxPostCondition } from './stx-post-condition';
import { PostConditionsList } from './post-conditions-list';
import { NoPostConditions } from './no-post-conditions';

function PostConditionsSuspense(): JSX.Element | null {
  const postConditions = useTransactionPostConditions();
  const mode = usePostConditionModeState();
  const pendingTransaction = useTransactionRequestState();
  const hasPostConditions = useMemo(
    () => postConditions && postConditions?.length > 0,
    [postConditions]
  );
  const isStxTransfer =
    pendingTransaction?.txType === TransactionTypes.STXTransfer && !hasPostConditions;

  if (!postConditions || !pendingTransaction) return <></>;
  if (!IS_TEST_ENV && mode === PostConditionMode.Allow) return null;

  return (
    <Flex
      border="4px solid"
      borderColor={color('border')}
      borderRadius="12px"
      width="100%"
      flexDirection="column"
    >
      {hasPostConditions ? (
        <PostConditionsList />
      ) : isStxTransfer ? (
        <StxPostCondition />
      ) : (
        <NoPostConditions />
      )}
    </Flex>
  );
}

export function PostConditions(): JSX.Element {
  return (
    <Suspense fallback={<></>}>
      <PostConditionsSuspense />
    </Suspense>
  );
}
