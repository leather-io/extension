import { TransactionRequestSelectors } from '@tests/selectors/requests.selectors';
import { useFormikContext } from 'formik';

import { HIGH_FEE_AMOUNT_STX } from '@shared/constants';
import { StacksTransactionFormValues } from '@shared/models/form.model';
import { isEmpty } from '@shared/utils';

import { useDrawers } from '@app/common/hooks/use-drawers';
import { useTransactionError } from '@app/features/stacks-transaction-request/hooks/use-transaction-error';
import { Button } from '@app/ui/components/button/button';

export function SubmitAction() {
  const { handleSubmit, values, validateForm, isSubmitting } =
    useFormikContext<StacksTransactionFormValues>();
  const { isShowingHighFeeConfirmation, setIsShowingHighFeeConfirmation } = useDrawers();
  const error = useTransactionError();

  const isDisabled = !!error || Number(values.fee) < 0;

  const onConfirmTransaction = async () => {
    // Check for errors before showing the high fee confirmation
    const formErrors = await validateForm();
    if (isEmpty(formErrors) && Number(values.fee) > HIGH_FEE_AMOUNT_STX) {
      return setIsShowingHighFeeConfirmation(!isShowingHighFeeConfirmation);
    }
    handleSubmit();
  };

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
