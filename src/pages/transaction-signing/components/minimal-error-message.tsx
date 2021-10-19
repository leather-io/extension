import { Caption } from '@components/typography';
import { Box, color, Stack, StackProps } from '@stacks/ui';
import { useTransactionBroadcastError } from '@store/transactions/requests.hooks';
import { TransactionsSelectors } from '@tests/integration/transactions.selectors';
import React from 'react';
import { memo } from 'react';
import { FiAlertTriangle } from 'react-icons/fi';
import { useTransactionError } from '../hooks/use-transaction-error';
import { TransactionErrorReason } from './errors/transaction-error';

const MinimalErrorMessageSuspense = memo((props: StackProps) => {
  const error = useTransactionError();
  const broadcastError = useTransactionBroadcastError();

  if (!error) return null;

  const getTitle = () => {
    if (error) {
      switch (error) {
        case TransactionErrorReason.Unauthorized:
          return 'Unauthorized request';
        case TransactionErrorReason.NoContract:
          return 'Contract not found';
        case TransactionErrorReason.InvalidContractAddress:
          return 'Invalid contract address';
        case TransactionErrorReason.StxTransferInsufficientFunds:
        case TransactionErrorReason.FeeInsufficientFunds:
          return 'Insufficient balance';
        case TransactionErrorReason.BroadcastError:
          return `Broadcast error: ${JSON.stringify(broadcastError)}`;
        case TransactionErrorReason.Generic:
          return 'Something went wrong';
      }
    }
    return null;
  };

  return (
    <Stack
      data-testid={TransactionsSelectors.TransactionErrorMessage}
      alignItems="center"
      bg="#FCEEED"
      p="base"
      borderRadius="12px"
      isInline
      {...props}
    >
      <Box color={color('feedback-error')} strokeWidth={2} as={FiAlertTriangle} />
      <Caption color={color('feedback-error')}>{getTitle()}</Caption>
    </Stack>
  );
});

export const MinimalErrorMessage = memo((props: StackProps) => {
  return (
    <React.Suspense fallback={<></>}>
      <MinimalErrorMessageSuspense {...props} />
    </React.Suspense>
  );
});
