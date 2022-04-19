import { memo, useCallback, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Formik } from 'formik';
import * as yup from 'yup';
import { Flex, Stack } from '@stacks/ui';

import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { useFeeSchema } from '@app/common/validation/use-fee-schema';
import { LoadingKeys, useLoading } from '@app/common/hooks/use-loading';
import { PageTop } from '@app/pages/transaction-request/components/page-top';
import { ContractCallDetails } from '@app/pages/transaction-request/components/contract-call-details/contract-call-details';
import { ContractDeployDetails } from '@app/pages/transaction-request/components/contract-deploy-details/contract-deploy-details';
import { PostConditions } from '@app/pages/transaction-request/components/post-conditions/post-conditions';
import { StxTransferDetails } from '@app/pages/transaction-request/components/stx-transfer-details/stx-transfer-details';
import { PostConditionModeWarning } from '@app/pages/transaction-request/components/post-condition-mode-warning';
import { TransactionError } from '@app/pages/transaction-request/components/transaction-error/transaction-error';

import {
  useTransactionRequestState,
  useUpdateTransactionBroadcastError,
} from '@app/store/transactions/requests.hooks';
import {
  useGenerateUnsignedStacksTransaction,
  useSoftwareWalletTransactionBroadcast,
} from '@app/store/transactions/transaction.hooks';
import { useFeeEstimationsState } from '@app/store/transactions/fees.hooks';
import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { TransactionFormValues } from '@app/common/transactions/transaction-utils';
import { Estimations } from '@shared/models/fees-types';
import { PopupHeader } from '@app/features/current-account/popup-header';
import { useWalletType } from '@app/common/use-wallet-type';
import { useLedgerNavigate } from '@app/features/ledger/hooks/use-ledger-navigate';
import { nonceSchema } from '@app/common/validation/nonce-schema';
import { EditNonceDrawer } from '@app/features/edit-nonce-drawer/edit-nonce-drawer';
import { HighFeeDrawer } from '@app/features/high-fee-drawer/high-fee-drawer';

import { TxRequestFormNonceSetter } from './components/tx-request-form-nonce-setter';
import { FeeForm } from './components/fee-form';
import { SubmitAction } from './components/submit-action';

// import { useTransactionValidator } from './hooks/use-transaction-validator';

function TransactionRequestBase(): JSX.Element | null {
  const transactionRequest = useTransactionRequestState();
  const { setIsLoading, setIsIdle } = useLoading(LoadingKeys.SUBMIT_TRANSACTION);
  const handleBroadcastTransaction = useSoftwareWalletTransactionBroadcast();
  const setBroadcastError = useUpdateTransactionBroadcastError();
  const [, setFeeEstimations] = useFeeEstimationsState();
  const feeSchema = useFeeSchema();
  const analytics = useAnalytics();
<<<<<<< HEAD
  const { walletType } = useWalletType();
  const generateUnsignedTx = useGenerateUnsignedStacksTransaction();
  const ledgerNavigate = useLedgerNavigate();
=======
  // const isValidTransaction = useTransactionRequestValidation();
  // const isDomainApproved = useIsDomainPreApproved();
  // const txValidationResult = useTransactionValidator();

  const validationSchema = !isSponsored ? yup.object({ fee: feeSchema() }) : null;
>>>>>>> 5cf51a947 (feat: request accounts)

  useRouteHeader(<PopupHeader />);

  useEffect(() => void analytics.track('view_transaction_signing'), [analytics]);

  const onSubmit = useCallback(
    async values => {
      if (walletType === 'ledger') {
        const tx = await generateUnsignedTx(values);
        if (!tx) return;
        ledgerNavigate.toConnectAndSignStep(tx);
        return;
      }
      setIsLoading();
      await handleBroadcastTransaction(values);
      setIsIdle();
      setFeeEstimations([]);
      void analytics.track('submit_fee_for_transaction', {
        type: values.feeType,
        fee: values.fee,
      });
      return () => {
        void setBroadcastError(null);
      };
    },
    [
      analytics,
      generateUnsignedTx,
      handleBroadcastTransaction,
      ledgerNavigate,
      setBroadcastError,
      setFeeEstimations,
      setIsIdle,
      setIsLoading,
      walletType,
    ]
  );

  if (!transactionRequest) return null;

  const validationSchema = !transactionRequest.sponsored
    ? yup.object({ fee: feeSchema(), nonce: nonceSchema })
    : null;

  const initialValues: Partial<TransactionFormValues> = {
    fee: '',
    feeType: Estimations[Estimations.Middle],
    nonce: '',
  };

  return (
    <Flex alignItems="center" flexDirection="column" width="100%">
      <Stack px="loose" spacing="loose">
        <PageTop />
        <PostConditionModeWarning />
        <TransactionError />
<<<<<<< HEAD
=======
        {/* {isValidTransaction ? null : (
        <ErrorMessage
          title="Unsigned transaction"
          body="This transaction has been made from an unsigned source"
        />
      )} */}
>>>>>>> 5cf51a947 (feat: request accounts)
        <PostConditions />
        {transactionRequest.txType === 'contract_call' && <ContractCallDetails />}
        {transactionRequest.txType === 'token_transfer' && <StxTransferDetails />}
        {transactionRequest.txType === 'smart_contract' && <ContractDeployDetails />}
        <Formik
<<<<<<< HEAD
          initialValues={initialValues}
=======
          initialValues={{ fee: '', feeType: Estimations[Estimations.Middle] }}
>>>>>>> 5cf51a947 (feat: request accounts)
          onSubmit={onSubmit}
          validateOnChange={false}
          validateOnBlur={false}
          validateOnMount={false}
          validationSchema={validationSchema}
        >
          {() => (
<<<<<<< HEAD
            <TxRequestFormNonceSetter>
              <FeeForm />
              <SubmitAction />
              <EditNonceDrawer />
              <HighFeeDrawer />
            </TxRequestFormNonceSetter>
          )}
        </Formik>
      </Stack>
      <Outlet />
=======
            <>
              <FeeForm />
              <SubmitAction />
              <HighFeeDrawer />
            </>
          )}
        </Formik>
      </Stack>
>>>>>>> 5cf51a947 (feat: request accounts)
    </Flex>
  );
}

export const TransactionRequest = memo(TransactionRequestBase);
