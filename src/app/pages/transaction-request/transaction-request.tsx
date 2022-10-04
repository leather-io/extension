import { memo } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Flex, Stack } from '@stacks/ui';
import { Formik } from 'formik';
import * as yup from 'yup';

import { useOnMount } from '@app/common/hooks/use-on-mount';
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
import { useTransactionRequestState } from '@app/store/transactions/requests.hooks';
import {
  useGenerateUnsignedStacksTransaction,
  useSoftwareWalletTransactionBroadcast,
  useTxRequestEstimatedUnsignedTxByteLengthState,
  useTxRequestSerializedUnsignedTxPayloadState,
} from '@app/store/transactions/transaction.hooks';
import { useFeeEstimations } from '@app/query/stacks/fees/fees.hooks';
import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { TransactionFormValues } from '@app/common/transactions/transaction-utils';
import { FeeType } from '@shared/models/fees-types';
import { PopupHeader } from '@app/features/current-account/popup-header';
import { useWalletType } from '@app/common/use-wallet-type';
import { useLedgerNavigate } from '@app/features/ledger/hooks/use-ledger-navigate';
import { nonceSchema } from '@app/common/validation/nonce-schema';
import { EditNonceDrawer } from '@app/features/edit-nonce-drawer/edit-nonce-drawer';
import { HighFeeDrawer } from '@app/features/high-fee-drawer/high-fee-drawer';
import { RequestingTabClosedWarningMessage } from '@app/features/errors/requesting-tab-closed-error-msg';
import { RouteUrls } from '@shared/route-urls';

import { TxRequestFormNonceSetter } from './components/tx-request-form-nonce-setter';
import { FeeForm } from './components/fee-form';
import { SubmitAction } from './components/submit-action';

function TransactionRequestBase() {
  const transactionRequest = useTransactionRequestState();
  const { setIsLoading, setIsIdle } = useLoading(LoadingKeys.SUBMIT_TRANSACTION);
  const handleBroadcastTransaction = useSoftwareWalletTransactionBroadcast();
  const txByteLength = useTxRequestEstimatedUnsignedTxByteLengthState();
  const txPayload = useTxRequestSerializedUnsignedTxPayloadState();
  const feeEstimations = useFeeEstimations(txByteLength, txPayload);
  const feeSchema = useFeeSchema();
  const analytics = useAnalytics();
  const { walletType } = useWalletType();
  const generateUnsignedTx = useGenerateUnsignedStacksTransaction();
  const ledgerNavigate = useLedgerNavigate();
  const navigate = useNavigate();

  useRouteHeader(<PopupHeader />);

  useOnMount(() => {
    void analytics.track('view_transaction_signing'), [analytics];
  });

  const onSubmit = async (values: TransactionFormValues) => {
    if (walletType === 'ledger') {
      const tx = await generateUnsignedTx(values);
      if (!tx) return;
      ledgerNavigate.toConnectAndSignTransactionStep(tx);
      return;
    }
    setIsLoading();

    const resp = await handleBroadcastTransaction(values);

    setIsIdle();

    if (resp?.error) {
      navigate(RouteUrls.TransactionBroadcastError, { state: { message: resp.error.message } });
      return;
    }

    void analytics.track('submit_fee_for_transaction', {
      calculation: feeEstimations.calculation,
      fee: values.fee,
      type: values.feeType,
    });
  };

  if (!transactionRequest) return null;

  const validationSchema = !transactionRequest.sponsored
    ? yup.object({ fee: feeSchema(), nonce: nonceSchema })
    : null;

  const initialValues: TransactionFormValues = {
    fee: '',
    feeType: FeeType[FeeType.Middle],
    nonce: '',
  };

  return (
    <Flex alignItems="center" flexDirection="column" width="100%">
      <Stack px="loose" spacing="loose">
        <PageTop />
        <RequestingTabClosedWarningMessage />
        <PostConditionModeWarning />
        <TransactionError />
        <PostConditions />
        {transactionRequest.txType === 'contract_call' && <ContractCallDetails />}
        {transactionRequest.txType === 'token_transfer' && <StxTransferDetails />}
        {transactionRequest.txType === 'smart_contract' && <ContractDeployDetails />}
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validateOnChange={false}
          validateOnBlur={false}
          validateOnMount={false}
          validationSchema={validationSchema}
        >
          {() => (
            <TxRequestFormNonceSetter>
              <FeeForm feeEstimations={feeEstimations.estimates} />
              <SubmitAction />
              <EditNonceDrawer />
              <HighFeeDrawer />
            </TxRequestFormNonceSetter>
          )}
        </Formik>
      </Stack>
      <Outlet />
    </Flex>
  );
}

export const TransactionRequest = memo(TransactionRequestBase);
