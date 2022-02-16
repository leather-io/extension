import { memo, useCallback, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Formik } from 'formik';
import * as yup from 'yup';
import { Flex, Stack } from '@stacks/ui';

import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { useFeeSchema } from '@app/common/validation/use-fee-schema';
import { LoadingKeys, useLoading } from '@app/common/hooks/use-loading';
import { useNextTxNonce } from '@app/common/hooks/account/use-next-tx-nonce';
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
  useLocalTransactionInputsState,
  useSoftwareWalletTransactionBroadcast,
  useUnsignedStacksTransaction,
} from '@app/store/transactions/transaction.hooks';
import { useFeeEstimationsState } from '@app/store/transactions/fees.hooks';

import { FeeForm } from './components/fee-form';
import { SubmitAction } from './components/submit-action';
import { useUnsignedTransactionFee } from './hooks/use-signed-transaction-fee';
import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { Estimations } from '@shared/models/fees-types';
import { PopupHeader } from '@app/features/current-account/popup-header';
import { useWalletType } from '@app/common/use-wallet-type';
import { useLedgerNavigate } from '@app/features/ledger/hooks/use-ledger-navigate';

function TransactionRequestBase(): JSX.Element | null {
  useNextTxNonce();
  const transactionRequest = useTransactionRequestState();
  const { setIsLoading, setIsIdle } = useLoading(LoadingKeys.SUBMIT_TRANSACTION);
  const handleBroadcastTransaction = useSoftwareWalletTransactionBroadcast();
  const setBroadcastError = useUpdateTransactionBroadcastError();
  const [, setFeeEstimations] = useFeeEstimationsState();
  const [, setTxData] = useLocalTransactionInputsState();
  const { isSponsored } = useUnsignedTransactionFee();
  const feeSchema = useFeeSchema();
  const analytics = useAnalytics();
  const { walletType } = useWalletType();
  const unsignedTx = useUnsignedStacksTransaction();
  const ledgerNavigate = useLedgerNavigate();

  const validationSchema = !isSponsored ? yup.object({ fee: feeSchema() }) : null;

  useRouteHeader(<PopupHeader />);

  useEffect(() => void analytics.track('view_transaction_signing'), [analytics]);

  const onSubmit = useCallback(
    async values => {
      // Using the same pattern here as is used in the send tokens
      // form, but maybe we can get rid of global form state when
      // we refactor transaction signing?
      setTxData({
        amount: '',
        fee: values.fee,
        memo: '',
        recipient: '',
      });
      if (walletType === 'ledger' && unsignedTx) {
        ledgerNavigate.toConnectAndSignStep(unsignedTx);
        return;
      }
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
      ledgerNavigate,
      setBroadcastError,
      setFeeEstimations,
      setIsIdle,
      setIsLoading,
      setTxData,
      unsignedTx,
      walletType,
    ]
  );

  if (!transactionRequest) return null;

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
