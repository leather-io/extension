import React, { useCallback } from 'react';

import { LOADING_KEYS, useLoading } from '@common/hooks/use-loading';
import {
  ShowTxSettingsAction,
  ShowTxSettingsPlaceholder,
} from '@features/fee-nonce-drawers/components/show-tx-settings-action';
import { Button, ButtonProps } from '@stacks/ui';
import { useTransactionBroadcast } from '@store/transactions/transaction.hooks';
import { TransactionsSelectors } from '@tests/integration/transactions.selectors';

import { useTransactionError } from '../hooks/use-transaction-error';

const BaseConfirmButton = (props: ButtonProps) => (
  <Button borderRadius="10px" py="base" width="100%" {...props}>
    Confirm
  </Button>
);

const SubmitActionSuspense = (props: ButtonProps) => {
  const handleBroadcastTransaction = useTransactionBroadcast();
  const error = useTransactionError();
  const { setIsLoading, setIsIdle, isLoading } = useLoading(LOADING_KEYS.SUBMIT_TRANSACTION);

  const isDisabled = !!error;

  const handleSubmit = useCallback(async () => {
    setIsLoading();
    await handleBroadcastTransaction();
    setIsIdle();
  }, [setIsLoading, setIsIdle, handleBroadcastTransaction]);

  return (
    <>
      <BaseConfirmButton
        data-testid={TransactionsSelectors.BtnConfirmTransaction}
        onClick={handleSubmit}
        isLoading={isLoading}
        isDisabled={isDisabled}
        {...props}
      >
        Confirm
      </BaseConfirmButton>
    </>
  );
};

export const SubmitAction = (props: ButtonProps) => {
  return (
    <>
      <React.Suspense fallback={<BaseConfirmButton isLoading isDisabled {...props} />}>
        <SubmitActionSuspense {...props} />
      </React.Suspense>
      <React.Suspense fallback={<ShowTxSettingsPlaceholder />}>
        <ShowTxSettingsAction />
      </React.Suspense>
    </>
  );
};
