import { memo, Suspense } from 'react';
import { FiAlertTriangle } from 'react-icons/fi';
import { Box, color, Stack, StackProps } from '@stacks/ui';

import { Caption } from '@app/components/typography';
import { useTransactionError } from '@app/pages/transaction-request/hooks/use-transaction-error';
import { TransactionErrorReason } from '@app/pages/transaction-request/components/transaction-error/transaction-error';
import { TransactionSigningSelectors } from '@tests/page-objects/transaction-signing.selectors';

function MinimalErrorMessageSuspense(props: StackProps) {
  const error = useTransactionError();

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
        case TransactionErrorReason.Generic:
          return 'Something went wrong';
      }
    }
    return null;
  };

  return (
    <Stack
      data-testid={TransactionSigningSelectors.TransactionErrorMessage}
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
}

function MinimalErrorMessageBase(props: StackProps) {
  return (
    <Suspense fallback={<></>}>
      <MinimalErrorMessageSuspense {...props} />
    </Suspense>
  );
}

export const MinimalErrorMessage = memo(MinimalErrorMessageBase);
