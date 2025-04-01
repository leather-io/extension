import { FormError } from '@app/components/form-error';

interface TransactionErrorProps {
  isInsufficientBalance: boolean;
  isLoading: boolean;
}
export function TransactionError({ isInsufficientBalance, isLoading }: TransactionErrorProps) {
  if (isLoading) return null;
  if (isInsufficientBalance) return <FormError text="Available balance insufficient" />;
  return null;
}
