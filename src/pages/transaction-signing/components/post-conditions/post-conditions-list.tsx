import React, { useMemo } from 'react';
import { Box, Circle, color, Flex, Stack } from '@stacks/ui';

import { TransactionTypes } from '@stacks/connect';
import { stacksValue } from '@common/stacks-utils';
import { FiLock as IconLock } from 'react-icons/fi';
import { Body } from '@components/typography';
import { truncateMiddle } from '@stacks/ui-utils';

import { useTransactionRequest } from '@store/transactions/requests.hooks';
import { TransactionEventCard } from '../event-card';
import { FungiblePostConditionComponent } from './fungible-post-condition';
import { useTransactionPostConditions } from '@store/transactions/transaction.hooks';

import { usePostConditionModeState } from '@store/transactions/post-conditions.hooks';
import { PostConditionMode, PostConditionType } from '@stacks/transactions';
import { IS_TEST_ENV } from '@common/constants';
import { PostConditionComponent } from './post-condition';

function StxPostcondition() {
  const pendingTransaction = useTransactionRequest();
  if (!pendingTransaction || pendingTransaction.txType !== TransactionTypes.STXTransfer)
    return null;
  return (
    <TransactionEventCard
      title="You'll send exactly"
      iconChar="S"
      icon="STX"
      amount={stacksValue({ value: pendingTransaction.amount, withTicker: false })}
      ticker="STX"
      left="Stacks Token"
      right={
        pendingTransaction.txType === TransactionTypes.STXTransfer
          ? `To ${truncateMiddle(pendingTransaction.recipient, 4)}`
          : undefined
      }
    />
  );
}

function NoPostconditions() {
  return (
    <Stack alignItems="center" spacing="base" p="base-loose" isInline>
      <Circle bg={color('bg-4')} flexShrink={0}>
        <IconLock />
      </Circle>
      <Box flexGrow={1}>
        <Body>
          No transfers (besides fees) will be made from your account or the transaction will abort.
        </Body>
      </Box>
    </Stack>
  );
}

const PostConditionsList = () => {
  const postConditions = useTransactionPostConditions();

  return (
    <>
      {postConditions?.map((pc, index) => {
        if (pc.conditionType === PostConditionType.Fungible) {
          return (
            <FungiblePostConditionComponent
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
            <PostConditionComponent
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
};

export const PostConditionsSuspense: React.FC = () => {
  const postConditions = useTransactionPostConditions();
  const mode = usePostConditionModeState();
  const pendingTransaction = useTransactionRequest();
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
        <StxPostcondition />
      ) : (
        <NoPostconditions />
      )}
    </Flex>
  );
};

export const PostConditions = () => {
  return (
    <React.Suspense fallback={<></>}>
      <PostConditionsSuspense />
    </React.Suspense>
  );
};
