import { Suspense, memo } from 'react';

import { TransactionRequestSelectors } from '@tests/selectors/requests.selectors';
import { HStack, HstackProps } from 'leather-styles/jsx';
import { styled } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

import { ErrorIcon } from '@app/components/icons/error-icon';
import { TransactionErrorReason } from '@app/pages/transaction-request/components/transaction-error/transaction-error';
import { useTransactionError } from '@app/pages/transaction-request/hooks/use-transaction-error';

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
      // #4164 FIXME migrate colour
      bg="#FCEEED"
      borderRadius="12px"
      color={token('colors.error')}
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
