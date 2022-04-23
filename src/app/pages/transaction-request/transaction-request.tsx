import { memo, useCallback, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Formik } from 'formik';
import * as yup from 'yup';
import { Flex, Stack } from '@stacks/ui';

import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { useFeeSchema } from '@app/common/validation/use-fee-schema';
import { LoadingKeys, useLoading } from '@app/common/hooks/use-loading';
import { EditNonceDrawer } from '@app/features/edit-nonce-drawer/edit-nonce-drawer';
import { HighFeeDrawer } from '@app/features/high-fee-drawer/high-fee-drawer';
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
import { Estimations } from '@shared/models/fees-types';
import { PopupHeader } from '@app/features/current-account/popup-header';
import { useWalletType } from '@app/common/use-wallet-type';
import { useLedgerNavigate } from '@app/features/ledger/hooks/use-ledger-navigate';
import { nonceSchema } from '@app/common/validation/nonce-schema';

import { FeeForm } from './components/fee-form';
import { SubmitAction } from './components/submit-action';

function TransactionRequestBase(): JSX.Element | null {
  const transactionRequest = useTransactionRequestState();
  const { setIsLoading, setIsIdle } = useLoading(LoadingKeys.SUBMIT_TRANSACTION);
  const handleBroadcastTransaction = useSoftwareWalletTransactionBroadcast();
  const setBroadcastError = useUpdateTransactionBroadcastError();
  const [, setFeeEstimations] = useFeeEstimationsState();
  const feeSchema = useFeeSchema();
  const analytics = useAnalytics();
  const { walletType } = useWalletType();
  const generateUnsignedTx = useGenerateUnsignedStacksTransaction();
  const ledgerNavigate = useLedgerNavigate();

  useRouteHeader(<PopupHeader />);

  useEffect(() => void analytics.track('view_transaction_signing'), [analytics]);

  const onSubmit = useCallback(
    async values => {
      if (walletType === 'ledger' && generateUnsignedTx) {
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
        setBroadcastError(null);
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

  return (
    <Flex alignItems="center" flexDirection="column" width="100%">
      <Stack px="loose" spacing="loose">
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
              <EditNonceDrawer />
              <HighFeeDrawer />
            </>
          )}
        </Formik>
      </Stack>
      <Outlet />
    </Flex>
  );
}

export const TransactionRequest = memo(TransactionRequestBase);
