import { FormError } from '@app/components/error/form-error';

interface ApproveTransactionErrorProps {
  isLoading: boolean;
  isInsufficientBalance: boolean;
}

export function ApproveTransactionError({
  isLoading,
  isInsufficientBalance,
}: ApproveTransactionErrorProps) {
  if (isLoading) return null;
  if (isInsufficientBalance) return <FormError text="Available balance insufficient" />;
  return null;
}
