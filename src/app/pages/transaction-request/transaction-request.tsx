import { memo, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import { Formik, FormikHelpers } from 'formik';
import { Flex } from 'leather-styles/jsx';
import * as yup from 'yup';

import { HIGH_FEE_WARNING_LEARN_MORE_URL_STX } from '@leather-wallet/constants';
import { FeeTypes } from '@leather-wallet/models';
import {
  useCalculateStacksTxFees,
  useNextNonce,
  useStxAvailableUnlockedBalance,
} from '@leather-wallet/query';

import { logger } from '@shared/logger';
import { StacksTransactionFormValues } from '@shared/models/form.model';
import { RouteUrls } from '@shared/route-urls';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useOnMount } from '@app/common/hooks/use-on-mount';
import { stxFeeValidator } from '@app/common/validation/forms/fee-validators';
import { nonceValidator } from '@app/common/validation/nonce-validators';
import { NonceSetter } from '@app/components/nonce-setter';
import { HighFeeDialog } from '@app/features/dialogs/high-fee-dialog/high-fee-dialog';
import { RequestingTabClosedWarningMessage } from '@app/features/errors/requesting-tab-closed-error-msg';
import { ContractCallDetails } from '@app/features/stacks-transaction-request/contract-call-details/contract-call-details';
import { ContractDeployDetails } from '@app/features/stacks-transaction-request/contract-deploy-details/contract-deploy-details';
import { FeeForm } from '@app/features/stacks-transaction-request/fee-form';
import { useStacksBroadcastTransaction } from '@app/features/stacks-transaction-request/hooks/use-stacks-broadcast-transaction';
import { MinimalErrorMessage } from '@app/features/stacks-transaction-request/minimal-error-message';
import { PageTop } from '@app/features/stacks-transaction-request/page-top';
import { PostConditionModeWarning } from '@app/features/stacks-transaction-request/post-condition-mode-warning';
import { PostConditions } from '@app/features/stacks-transaction-request/post-conditions/post-conditions';
import { StxTransferDetails } from '@app/features/stacks-transaction-request/stx-transfer-details/stx-transfer-details';
import { SubmitAction } from '@app/features/stacks-transaction-request/submit-action';
import { TransactionError } from '@app/features/stacks-transaction-request/transaction-error/transaction-error';
import { useCurrentStacksAccountAddress } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { useTransactionRequestState } from '@app/store/transactions/requests.hooks';
import {
  useGenerateUnsignedStacksTransaction,
  useUnsignedStacksTransactionBaseState,
} from '@app/store/transactions/transaction.hooks';
import { Link } from '@app/ui/components/link/link';

function TransactionRequestBase() {
  const [isShowingHighFeeConfirmation, setIsShowingHighFeeConfirmation] = useState(false);

  const transactionRequest = useTransactionRequestState();
  const unsignedTx = useUnsignedStacksTransactionBaseState();
  const { data: stxFees } = useCalculateStacksTxFees(unsignedTx.transaction);
  const analytics = useAnalytics();
  const generateUnsignedTx = useGenerateUnsignedStacksTransaction();
  const stxAddress = useCurrentStacksAccountAddress();
  const availableUnlockedBalance = useStxAvailableUnlockedBalance(stxAddress);
  const { data: nextNonce } = useNextNonce(stxAddress);
  const navigate = useNavigate();
  const { stacksBroadcastTransaction } = useStacksBroadcastTransaction({ token: 'STX' });

  useOnMount(() => void analytics.track('view_transaction_signing'));

  async function onSubmit(
    values: StacksTransactionFormValues,
    formikHelpers: FormikHelpers<StacksTransactionFormValues>
  ) {
    formikHelpers.setSubmitting(true);
    const unsignedTx = await generateUnsignedTx(values);

    if (!unsignedTx)
      return logger.error('Failed to generate unsigned transaction in transaction-request');

    await stacksBroadcastTransaction(unsignedTx);

    void analytics.track('submit_fee_for_transaction', {
      calculation: stxFees?.calculation,
      fee: values.fee,
      type: values.feeType,
    });
    formikHelpers.setSubmitting(false);
  }

  if (!transactionRequest) return null;

  const validationSchema = !transactionRequest.sponsored
    ? yup.object({
        fee: stxFeeValidator(availableUnlockedBalance),
        nonce: nonceValidator,
      })
    : null;

  const initialValues: StacksTransactionFormValues = {
    fee: '',
    feeCurrency: 'STX',
    feeType: FeeTypes[FeeTypes.Middle],
    nonce: nextNonce?.nonce,
  };

  return (
    <Flex
      alignItems="center"
      background="ink.background-primary"
      flexDirection="column"
      p="space.05"
      width="100%"
    >
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validateOnChange={false}
        validateOnBlur={false}
        validateOnMount={false}
        validationSchema={validationSchema}
      >
        {() => (
          <>
            <PageTop />
            <RequestingTabClosedWarningMessage />
            <PostConditionModeWarning />
            <TransactionError />
            <PostConditions />
            {transactionRequest.txType === 'contract_call' && <ContractCallDetails />}
            {transactionRequest.txType === 'token_transfer' && <StxTransferDetails />}
            {transactionRequest.txType === 'smart_contract' && <ContractDeployDetails />}

            <NonceSetter />
            <FeeForm fees={stxFees} />
            <Link alignSelf="flex-end" my="space.04" onClick={() => navigate(RouteUrls.EditNonce)}>
              Edit nonce
            </Link>
            <MinimalErrorMessage />
            <SubmitAction
              setIsShowingHighFeeConfirmation={() => setIsShowingHighFeeConfirmation(true)}
            />

            <HighFeeDialog
              isShowing={isShowingHighFeeConfirmation}
              learnMoreUrl={HIGH_FEE_WARNING_LEARN_MORE_URL_STX}
            />
            <Outlet />
          </>
        )}
      </Formik>
    </Flex>
  );
}

export const TransactionRequest = memo(TransactionRequestBase);
