import { Suspense, memo, useEffect } from 'react';

import { analytics } from '@shared/utils/analytics';

import { useTransactionError } from '@app/features/stacks-transaction-request/hooks/use-transaction-error';

import {
  ExpiredRequestErrorMessage,
  FeeInsufficientFundsErrorMessage,
  IncorrectContractAddressMessage,
  NoContractErrorMessage,
  StxTransferInsufficientFundsErrorMessage,
  UnauthorizedRequestRedirect,
} from './error-messages';

export enum TransactionErrorReason {
  StxTransferInsufficientFunds = 1,
  FeeInsufficientFunds = 2,
  Generic = 3,
  BroadcastError = 4,
  Unauthorized = 5,
  NoContract = 6,
  ExpiredRequest = 7,
  InvalidContractAddress = 8,
}

const TransactionErrorSuspense = memo(() => {
  const reason = useTransactionError();

  useEffect(() => {
    if (!reason) return;
    void analytics.track('view_transaction_signing_error', {
      reason: TransactionErrorReason[reason].toLowerCase(),
    });
  }, [reason]);

  if (!reason) return null;

  switch (reason) {
    case TransactionErrorReason.NoContract:
      return <NoContractErrorMessage />;
    case TransactionErrorReason.InvalidContractAddress:
      return <IncorrectContractAddressMessage />;
    case TransactionErrorReason.StxTransferInsufficientFunds:
      return <StxTransferInsufficientFundsErrorMessage />;
    case TransactionErrorReason.FeeInsufficientFunds:
      return <FeeInsufficientFundsErrorMessage />;
    case TransactionErrorReason.Unauthorized:
      return <UnauthorizedRequestRedirect />;
    case TransactionErrorReason.ExpiredRequest:
      return <ExpiredRequestErrorMessage />;
    default:
      return null;
  }
});

export function TransactionError() {
  return (
    <Suspense fallback={<></>}>
      <TransactionErrorSuspense />
    </Suspense>
  );
}
