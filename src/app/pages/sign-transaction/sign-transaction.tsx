import { memo, useCallback, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import * as yup from 'yup';
import { Stack } from '@stacks/ui';

import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { useFeeSchema } from '@app/common/validation/use-fee-schema';
import { LoadingKeys, useLoading } from '@app/common/hooks/use-loading';
import { useNextTxNonce } from '@app/common/hooks/account/use-next-tx-nonce';
import { HighFeeDrawer } from '@app/features/high-fee-drawer/high-fee-drawer';
import { PopupHeader } from '@app/pages/sign-transaction/components/popup-header';
import { PageTop } from '@app/pages/sign-transaction/components/page-top';
import { ContractCallDetails } from '@app/pages/sign-transaction/components/contract-call-details/contract-call-details';
import { ContractDeployDetails } from '@app/pages/sign-transaction/components/contract-deploy-details/contract-deploy-details';
import { PostConditions } from '@app/pages/sign-transaction/components/post-conditions/post-conditions';
import { StxTransferDetails } from '@app/pages/sign-transaction/components/stx-transfer-details/stx-transfer-details';
import { PostConditionModeWarning } from '@app/pages/sign-transaction/components/post-condition-mode-warning';
import { TransactionError } from '@app/pages/sign-transaction/components/transaction-error/transaction-error';
import {
  useTransactionRequestState,
  useUpdateTransactionBroadcastError,
} from '@app/store/transactions/requests.hooks';
import {
  useLocalTransactionInputsState,
  useTransactionBroadcast,
} from '@app/store/transactions/transaction.hooks';
import { useFeeEstimationsState } from '@app/store/transactions/fees.hooks';

import { FeeForm } from './components/fee-form';
import { SubmitAction } from './components/submit-action';
import { UnauthorizedErrorMessage } from './components/transaction-error/error-messages';
import { useUnsignedTransactionFee } from './hooks/use-signed-transaction-fee';
import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { Estimations } from '@shared/models/fees-types';
import { RouteUrls } from '@shared/route-urls';

function SignTransactionBase(): JSX.Element | null {
  useNextTxNonce();
  const transactionRequest = useTransactionRequestState();
  const { setIsLoading, setIsIdle } = useLoading(LoadingKeys.SUBMIT_TRANSACTION);
  const handleBroadcastTransaction = useTransactionBroadcast();
  const setBroadcastError = useUpdateTransactionBroadcastError();
  const [, setFeeEstimations] = useFeeEstimationsState();
  const [, setTxData] = useLocalTransactionInputsState();
  const { isSponsored } = useUnsignedTransactionFee();
  const feeSchema = useFeeSchema();
  const analytics = useAnalytics();
  const navigate = useNavigate();

  const validationSchema = !isSponsored ? yup.object({ fee: feeSchema() }) : null;

  useRouteHeader(<PopupHeader />);

  useEffect(() => {
    void analytics.track('view_transaction_signing');
  }, [analytics]);

  const onSubmit = useCallback(
    async values => {
      // TODO (Ledger): Detect if using ledger to connect/sign the tx
      // before broadcasting. This is temporary for testing the UI.
      navigate(RouteUrls.SignLedgerTransaction);
      return;

      // Using the same pattern here as is used in the send tokens
      // form, but maybe we can get rid of global form state when
      // we refactor transaction signing?
      setTxData({
        amount: '',
        fee: values.fee,
        memo: '',
        recipient: '',
      });

      setIsLoading();
      await handleBroadcastTransaction();
      setIsIdle();
      setFeeEstimations([]);
      void analytics.track('submit_fee_for_transaction', {
        type: values.feeType,
        fee: values.fee,
      });
      return () => {
        setBroadcastError(null);
        setTxData(null);
      };
    },
    [
      analytics,
      handleBroadcastTransaction,
      navigate,
      setBroadcastError,
      setFeeEstimations,
      setIsIdle,
      setIsLoading,
      setTxData,
    ]
  );

  if (!transactionRequest) return null;
  // This renders when a user has not properly signed out of an app
  // and attempts to perform a transaction
  if (!handleBroadcastTransaction) return <UnauthorizedErrorMessage />;

  return (
    <Stack spacing="loose">
      <PageTop />
      <PostConditionModeWarning />
      <TransactionError />
      <PostConditions />
      {transactionRequest.txType === 'contract_call' && <ContractCallDetails />}
      {transactionRequest.txType === 'token_transfer' && <StxTransferDetails />}
      {transactionRequest.txType === 'smart_contract' && <ContractDeployDetails />}
      <Formik
        initialValues={{ fee: '', feeType: Estimations[Estimations.Middle] }}
        onSubmit={onSubmit}
        validateOnChange={false}
        validateOnBlur={false}
        validateOnMount={false}
        validationSchema={validationSchema}
      >
        {() => (
          <>
            <FeeForm />
            <SubmitAction />
            <HighFeeDrawer />
          </>
        )}
      </Formik>
      <Outlet />
    </Stack>
  );
}

export const SignTransaction = memo(SignTransactionBase);
