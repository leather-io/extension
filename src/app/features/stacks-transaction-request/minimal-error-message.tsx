import { Suspense, memo } from 'react';

import { TransactionRequestSelectors } from '@tests/selectors/requests.selectors';
import { HStack, HstackProps, styled } from 'leather-styles/jsx';

import { useTransactionError } from '@app/features/stacks-transaction-request/hooks/use-transaction-error';
import { TransactionErrorReason } from '@app/features/stacks-transaction-request/transaction-error/transaction-error';
import { ErrorIcon } from '@app/ui/components/icons/error-icon';

function MinimalErrorMessageSuspense(props: HstackProps) {
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
    <HStack
      alignItems="center"
      // #4476 TODO change this colour
      bg="#FCEEED"
      borderRadius="md"
      color="error.label"
      p="space.04"
      width="100%"
      {...props}
    >
      <ErrorIcon />
      <styled.span data-testid={TransactionRequestSelectors.ErrorMessage} textStyle="caption.01">
        {getTitle()}
      </styled.span>
    </HStack>
  );
}

function MinimalErrorMessageBase(props: HstackProps) {
  return (
    <Suspense fallback={<></>}>
      <MinimalErrorMessageSuspense {...props} />
    </Suspense>
  );
}

export const MinimalErrorMessage = memo(MinimalErrorMessageBase);
