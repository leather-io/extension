import { TransactionRequestSelectors } from '@tests/selectors/requests.selectors';
import { useFormikContext } from 'formik';

import { Button } from '@leather.io/ui';

import { StacksTransactionFormValues } from '@shared/models/form.model';

import { useTransactionError } from '@app/features/stacks-transaction-request/hooks/use-transaction-error';

import { useStacksHighFeeWarningContext } from '../stacks-high-fee-warning/stacks-high-fee-warning-container';

interface Props {
  canSubmit: boolean;
}

export function StacksTxSubmitAction({ canSubmit }: Props) {
  const { handleSubmit, values, validateForm, isSubmitting } =
    useFormikContext<StacksTransactionFormValues>();

  const context = useStacksHighFeeWarningContext();

  const error = useTransactionError();

  const isDisabled = !!error || Number(values.fee) < 0 || !canSubmit;

  async function onConfirmTransaction() {
    const formErrors = await validateForm();

    if (context.isHighFeeWithNoFormErrors(formErrors, values.fee))
      return context.setShowHighFeeWarningSheet(true);

    handleSubmit();
  }

  return (
    <Button
      aria-busy={isSubmitting}
      data-testid={TransactionRequestSelectors.BtnConfirmTransaction}
      disabled={isDisabled}
      fullWidth
      mt="space.04"
      onClick={onConfirmTransaction}
      type="submit"
    >
      Confirm
    </Button>
  );
}
