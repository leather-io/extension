import { memo, Suspense } from 'react';

import { useTransactionError } from '@app/pages/sign-transaction/hooks/use-transaction-error';

import {
  BroadcastErrorMessage,
  ExpiredRequestErrorMessage,
  FeeInsufficientFundsErrorMessage,
  IncorrectContractAddressMessage,
  NoContractErrorMessage,
  StxTransferInsufficientFundsErrorMessage,
  UnauthorizedErrorMessage,
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
  if (!reason) return null;

  switch (reason) {
    case TransactionErrorReason.NoContract:
      return <NoContractErrorMessage />;
    case TransactionErrorReason.InvalidContractAddress:
      return <IncorrectContractAddressMessage />;
    case TransactionErrorReason.StxTransferInsufficientFunds:
      return <StxTransferInsufficientFundsErrorMessage />;
    case TransactionErrorReason.BroadcastError:
      return <BroadcastErrorMessage />;
    case TransactionErrorReason.FeeInsufficientFunds:
      return <FeeInsufficientFundsErrorMessage />;
    case TransactionErrorReason.Unauthorized:
      return <UnauthorizedErrorMessage />;
    case TransactionErrorReason.ExpiredRequest:
      return <ExpiredRequestErrorMessage />;
    default:
      return null;
  }
});

function TransactionErrorBase(): JSX.Element {
  return (
    <Suspense fallback={<></>}>
      <TransactionErrorSuspense />
    </Suspense>
  );
}

export const TransactionError = memo(TransactionErrorBase);
