import { Suspense } from 'react';
import { useFormikContext } from 'formik';
import { Button, ButtonProps } from '@stacks/ui';

import { HIGH_FEE_AMOUNT_STX } from '@shared/constants';
import { useDrawers } from '@app/common/hooks/use-drawers';
import { LoadingKeys, useLoading } from '@app/common/hooks/use-loading';
import { TransactionFormValues } from '@app/common/transactions/transaction-utils';
import { isEmpty } from '@shared/utils';
import { ShowEditNonceAction, ShowEditNoncePlaceholder } from '@app/components/show-edit-nonce';
import { useTransactionError } from '@app/pages/transaction-request/hooks/use-transaction-error';
import { useFeeEstimationsState } from '@app/store/transactions/fees.hooks';
import { TransactionSigningSelectors } from '@tests/page-objects/transaction-signing.selectors';

function BaseConfirmButton(props: ButtonProps): JSX.Element {
  return (
    <Button borderRadius="10px" py="base" type="submit" width="100%" {...props}>
      Confirm
    </Button>
  );
}

function SubmitActionSuspense(): JSX.Element {
  const { handleSubmit, values, validateForm } = useFormikContext<TransactionFormValues>();
  const { showHighFeeConfirmation, setShowHighFeeConfirmation } = useDrawers();
  const { isLoading } = useLoading(LoadingKeys.SUBMIT_TRANSACTION);
  const error = useTransactionError();
  const [feeEstimations] = useFeeEstimationsState();

  const isDisabled = !!error || !feeEstimations.length;

  return (
    <BaseConfirmButton
      data-testid={TransactionSigningSelectors.BtnConfirmTransaction}
      onClick={async () => {
        // We need to check for errors here before we show the high fee confirmation
        const formErrors = await validateForm();
        if (isEmpty(formErrors) && values.fee > HIGH_FEE_AMOUNT_STX) {
          return setShowHighFeeConfirmation(!showHighFeeConfirmation);
        }
        handleSubmit();
      }}
      isLoading={isLoading}
      isDisabled={isDisabled}
    >
      Confirm
    </BaseConfirmButton>
  );
}

export function SubmitAction(): JSX.Element {
  return (
    <>
      <Suspense fallback={<BaseConfirmButton isLoading isDisabled />}>
        <SubmitActionSuspense />
      </Suspense>
      <Suspense fallback={<ShowEditNoncePlaceholder />}>
        <ShowEditNonceAction />
      </Suspense>
    </>
  );
}
