import React, { Suspense } from 'react';
import { useFormikContext } from 'formik';
import { Button, ButtonProps } from '@stacks/ui';

import { LoadingKeys, useLoading } from '@common/hooks/use-loading';
import {
  ShowEditNonceAction,
  ShowEditNoncePlaceholder,
} from '@pages/sign-transaction/components/show-edit-nonce';
import { useTransactionError } from '@pages/sign-transaction/hooks/use-transaction-error';
import { TransactionsSelectors } from '@tests/integration/transactions.selectors';

function SubmitActionSuspense(): JSX.Element {
  const { handleSubmit } = useFormikContext();
  const error = useTransactionError();
  const { isLoading } = useLoading(LoadingKeys.SUBMIT_TRANSACTION);

  const isDisabled = !!error;

  return (
    <BaseConfirmButton
      data-testid={TransactionsSelectors.BtnConfirmTransaction}
      onClick={handleSubmit}
      isLoading={isLoading}
      isDisabled={isDisabled}
    >
      Confirm
    </BaseConfirmButton>
  );
}

function BaseConfirmButton(props: ButtonProps): JSX.Element {
  return (
    <Button borderRadius="10px" py="base" type="submit" width="100%" {...props}>
      Confirm
    </Button>
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
