import { useIsDomainPreApproved } from '@app/store/apps/apps.actions';
import {
  useTransactionRequestOrigin,
  useTransactionRequestValidation,
} from '@app/store/transactions/requests.hooks';

interface SuccesfullTransactionValidationResult {
  isValid: true;
  validatedBy: 'jwt-payload' | 'preapproved-domain';
}

interface FailedTransactionValidationResult {
  isValid: false;
}

type TransactionValidationResult =
  | SuccesfullTransactionValidationResult
  | FailedTransactionValidationResult;

const invalidTxResult: FailedTransactionValidationResult = Object.seal({
  isValid: false,
});

const validatedBySignedJwtPayload: SuccesfullTransactionValidationResult = Object.seal({
  isValid: true,
  validatedBy: 'jwt-payload',
});

const validatedByPreapprovedDomain: SuccesfullTransactionValidationResult = Object.seal({
  isValid: true,
  validatedBy: 'preapproved-domain',
});

export function useTransactionValidator(): TransactionValidationResult {
  const isValidTransaction = useTransactionRequestValidation();
  const origin = useTransactionRequestOrigin();
  const isDomainApproved = useIsDomainPreApproved();

  if (isValidTransaction) return validatedBySignedJwtPayload;

  if (isDomainApproved(origin || '')) return validatedByPreapprovedDomain;

  return invalidTxResult;
}
