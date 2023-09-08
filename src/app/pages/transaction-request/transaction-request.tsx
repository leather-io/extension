import { memo } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import { Formik } from 'formik';
import { Flex } from 'leather-styles/jsx';
import get from 'lodash.get';
import * as yup from 'yup';

import { HIGH_FEE_WARNING_LEARN_MORE_URL_STX } from '@shared/constants';
import { FeeTypes } from '@shared/models/fees/fees.model';
import { StacksTransactionFormValues } from '@shared/models/form.model';
import { RouteUrls } from '@shared/route-urls';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { LoadingKeys, useLoading } from '@app/common/hooks/use-loading';
import { useOnMount } from '@app/common/hooks/use-on-mount';
import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { useWalletType } from '@app/common/use-wallet-type';
import { stxFeeValidator } from '@app/common/validation/forms/fee-validators';
import { nonceValidator } from '@app/common/validation/nonce-validators';
import { EditNonceButton } from '@app/components/edit-nonce-button';
import { NonceSetter } from '@app/components/nonce-setter';
import { PopupHeader } from '@app/features/current-account/popup-header';
import { RequestingTabClosedWarningMessage } from '@app/features/errors/requesting-tab-closed-error-msg';
import { HighFeeDrawer } from '@app/features/high-fee-drawer/high-fee-drawer';
import { useLedgerNavigate } from '@app/features/ledger/hooks/use-ledger-navigate';
import { ContractCallDetails } from '@app/pages/transaction-request/components/contract-call-details/contract-call-details';
import { ContractDeployDetails } from '@app/pages/transaction-request/components/contract-deploy-details/contract-deploy-details';
import { PageTop } from '@app/pages/transaction-request/components/page-top';
import { PostConditionModeWarning } from '@app/pages/transaction-request/components/post-condition-mode-warning';
import { PostConditions } from '@app/pages/transaction-request/components/post-conditions/post-conditions';
import { StxTransferDetails } from '@app/pages/transaction-request/components/stx-transfer-details/stx-transfer-details';
import { TransactionError } from '@app/pages/transaction-request/components/transaction-error/transaction-error';
import { useCurrentStacksAccountAnchoredBalances } from '@app/query/stacks/balance/stx-balance.hooks';
import { useCalculateStacksTxFees } from '@app/query/stacks/fees/fees.hooks';
import { useNextNonce } from '@app/query/stacks/nonce/account-nonces.hooks';
import { useTransactionRequestState } from '@app/store/transactions/requests.hooks';
import {
  useGenerateUnsignedStacksTransaction,
  useSoftwareWalletTransactionRequestBroadcast,
  useUnsignedStacksTransactionBaseState,
} from '@app/store/transactions/transaction.hooks';

import { FeeForm } from './components/fee-form';
import { MinimalErrorMessage } from './components/minimal-error-message';
import { SubmitAction } from './components/submit-action';

function TransactionRequestBase() {
  const transactionRequest = useTransactionRequestState();
  const { setIsLoading, setIsIdle } = useLoading(LoadingKeys.SUBMIT_TRANSACTION);
  const handleBroadcastTransaction = useSoftwareWalletTransactionRequestBroadcast();
  const unsignedTx = useUnsignedStacksTransactionBaseState();
  const { data: stxFees } = useCalculateStacksTxFees(unsignedTx.transaction);
  const analytics = useAnalytics();
  const { walletType } = useWalletType();
  const generateUnsignedTx = useGenerateUnsignedStacksTransaction();
  const { data: stacksBalances } = useCurrentStacksAccountAnchoredBalances();
  const ledgerNavigate = useLedgerNavigate();
  const { data: nextNonce } = useNextNonce();
  const navigate = useNavigate();

  useRouteHeader(<PopupHeader />);

  useOnMount(() => {
    void analytics.track('view_transaction_signing'), [analytics];
  });

  const onSubmit = async (values: StacksTransactionFormValues) => {
    if (walletType === 'ledger') {
      const tx = await generateUnsignedTx(values);
      if (!tx) return;
      ledgerNavigate.toConnectAndSignTransactionStep(tx);
      return;
    }
    setIsLoading();

    try {
      await handleBroadcastTransaction(values);
      setIsIdle();
    } catch (e) {
      navigate(RouteUrls.TransactionBroadcastError, { state: { message: get(e, 'message') } });
      return;
    }

    void analytics.track('submit_fee_for_transaction', {
      calculation: stxFees?.calculation,
      fee: values.fee,
      type: values.feeType,
    });
  };

  if (!transactionRequest) return null;

  const validationSchema = !transactionRequest.sponsored
    ? yup.object({
        fee: stxFeeValidator(stacksBalances?.stx.unlockedStx),
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
    <Flex alignItems="center" flexDirection="column" p="space.05" width="100%">
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
          <>
            <NonceSetter>
              <FeeForm fees={stxFees} />
              <EditNonceButton
                alignSelf="flex-end"
                my="space.04"
                onEditNonce={() => navigate(RouteUrls.EditNonce)}
              />
              <MinimalErrorMessage />
              <SubmitAction />
              <HighFeeDrawer learnMoreUrl={HIGH_FEE_WARNING_LEARN_MORE_URL_STX} />
            </NonceSetter>
            <Outlet />
          </>
        )}
      </Formik>
    </Flex>
  );
}

export const TransactionRequest = memo(TransactionRequestBase);
