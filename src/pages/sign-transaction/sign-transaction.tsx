import React, { memo, Suspense, useCallback } from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import { Stack } from '@stacks/ui';

import { useFeeSchema } from '@common/validation/use-fee-schema';
import { LoadingKeys, useLoading } from '@common/hooks/use-loading';
import { useNextTxNonce } from '@common/hooks/account/use-next-tx-nonce';
import { stxToMicroStx } from '@common/stacks-utils';
import { PopupContainer } from '@components/popup/container';
import { HighFeeDrawer } from '@features/high-fee-drawer/high-fee-drawer';
import { PopupHeader } from '@pages/sign-transaction/components/popup-header';
import { PageTop } from '@pages/sign-transaction/components/page-top';
import { ContractCallDetails } from '@pages/sign-transaction/components/contract-call-details/contract-call-details';
import { ContractDeployDetails } from '@pages/sign-transaction/components/contract-deploy-details/contract-deploy-details';
import { PostConditions } from '@pages/sign-transaction/components/post-conditions/post-conditions';
import { StxTransferDetails } from '@pages/sign-transaction/components/stx-transfer-details/stx-transfer-details';
import { PostConditionModeWarning } from '@pages/sign-transaction/components/post-condition-mode-warning';
import { TransactionError } from '@pages/sign-transaction/components/transaction-error/transaction-error';
import {
  useTransactionRequestState,
  useUpdateTransactionBroadcastError,
} from '@store/transactions/requests.hooks';
import { useTransactionBroadcast } from '@store/transactions/transaction.hooks';
import {
  useFeeEstimationsState,
  useFeeRateState,
  useFeeState,
} from '@store/transactions/fees.hooks';

import { FeeForm } from './components/fee-form';
import { SubmitAction } from './components/submit-action';

function SignTransactionBase(): JSX.Element | null {
  useNextTxNonce();
  const transactionRequest = useTransactionRequestState();
  const { setIsLoading, setIsIdle } = useLoading(LoadingKeys.SUBMIT_TRANSACTION);
  const handleBroadcastTransaction = useTransactionBroadcast();
  const setBroadcastError = useUpdateTransactionBroadcastError();
  const [, setFeeEstimations] = useFeeEstimationsState();
  const [, setFee] = useFeeState();
  const [, setFeeRate] = useFeeRateState();
  const feeSchema = useFeeSchema();

  const onSubmit = useCallback(
    async values => {
      setFee(stxToMicroStx(values.txFee).toNumber());
      setIsLoading();
      await handleBroadcastTransaction();
      setIsIdle();
      setFeeEstimations([]);
      setFee(null);
      setFeeRate(null);
      return () => setBroadcastError(null);
    },
    [
      handleBroadcastTransaction,
      setBroadcastError,
      setFee,
      setFeeEstimations,
      setFeeRate,
      setIsIdle,
      setIsLoading,
    ]
  );

  if (!transactionRequest) return null;

  return (
    <PopupContainer header={<PopupHeader />}>
      <Stack spacing="loose">
        <PageTop />
        <PostConditionModeWarning />
        <TransactionError />
        <PostConditions />
        {transactionRequest.txType === 'contract_call' && <ContractCallDetails />}
        {transactionRequest.txType === 'token_transfer' && <StxTransferDetails />}
        {transactionRequest.txType === 'smart_contract' && <ContractDeployDetails />}
        <Suspense fallback={<></>}>
          <Formik
            initialValues={{ txFee: '' }}
            onSubmit={onSubmit}
            validateOnChange={false}
            validateOnBlur={false}
            validateOnMount={false}
            validationSchema={yup.object({
              txFee: feeSchema(),
            })}
          >
            {() => (
              <>
                <FeeForm />
                <SubmitAction />
                <HighFeeDrawer />
              </>
            )}
          </Formik>
        </Suspense>
      </Stack>
    </PopupContainer>
  );
}

export const SignTransaction = memo(SignTransactionBase);
