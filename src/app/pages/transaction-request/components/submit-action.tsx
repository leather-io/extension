import { Suspense } from 'react';

import { Button, ButtonProps } from '@stacks/ui';
import { TransactionSigningSelectors } from '@tests-legacy/page-objects/transaction-signing.selectors';
import { useFormikContext } from 'formik';

import { HIGH_FEE_AMOUNT_STX } from '@shared/constants';
import { StacksTransactionFormValues } from '@shared/models/form.model';
import { isEmpty } from '@shared/utils';

import { useDrawers } from '@app/common/hooks/use-drawers';
import { LoadingKeys, useLoading } from '@app/common/hooks/use-loading';
import { useTransactionError } from '@app/pages/transaction-request/hooks/use-transaction-error';

function BaseConfirmButton(props: ButtonProps): React.JSX.Element {
  return (
    <Button borderRadius="10px" mt="base" py="base" type="submit" width="100%" {...props}>
      Confirm
    </Button>
  );
}

export function SubmitAction() {
  const { handleSubmit, values, validateForm } = useFormikContext<StacksTransactionFormValues>();
  const { isShowingHighFeeConfirmation, setIsShowingHighFeeConfirmation } = useDrawers();
  const { isLoading } = useLoading(LoadingKeys.SUBMIT_TRANSACTION);
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
    <Suspense fallback={<BaseConfirmButton isLoading isDisabled />}>
      <BaseConfirmButton
        data-testid={TransactionSigningSelectors.BtnConfirmTransaction}
        isDisabled={isDisabled}
        isLoading={isLoading}
        onClick={onConfirmTransaction}
      >
        Confirm
      </BaseConfirmButton>
    </Suspense>
  );
}
