import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { StacksTransaction } from '@stacks/transactions';
import { Formik } from 'formik';
import { Flex } from 'leather-styles/jsx';
import * as yup from 'yup';

import { HIGH_FEE_WARNING_LEARN_MORE_URL_STX } from '@shared/constants';
import { FeeTypes } from '@shared/models/fees/fees.model';
import { StacksTransactionFormValues } from '@shared/models/form.model';
import { RouteUrls } from '@shared/route-urls';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useOnMount } from '@app/common/hooks/use-on-mount';
import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { stxToMicroStx } from '@app/common/money/unit-conversion';
import { stxFeeValidator } from '@app/common/validation/forms/fee-validators';
import { nonceValidator } from '@app/common/validation/nonce-validators';
import { NonceSetter } from '@app/components/nonce-setter';
import { PopupHeader } from '@app/features/current-account/popup-header';
import { RequestingTabClosedWarningMessage } from '@app/features/errors/requesting-tab-closed-error-msg';
import { HighFeeDrawer } from '@app/features/high-fee-drawer/high-fee-drawer';
import { ContractCallDetails } from '@app/features/stacks-transaction-request/contract-call-details/contract-call-details';
import { ContractDeployDetails } from '@app/features/stacks-transaction-request/contract-deploy-details/contract-deploy-details';
import { PageTop } from '@app/features/stacks-transaction-request/page-top';
import { PostConditionModeWarning } from '@app/features/stacks-transaction-request/post-condition-mode-warning';
import { PostConditions } from '@app/features/stacks-transaction-request/post-conditions/post-conditions';
import { StxTransferDetails } from '@app/features/stacks-transaction-request/stx-transfer-details/stx-transfer-details';
import { TransactionError } from '@app/features/stacks-transaction-request/transaction-error/transaction-error';
import { useCurrentStacksAccountAnchoredBalances } from '@app/query/stacks/balance/stx-balance.hooks';
import { useCalculateStacksTxFees } from '@app/query/stacks/fees/fees.hooks';
import { useNextNonce } from '@app/query/stacks/nonce/account-nonces.hooks';
import { useTransactionRequestState } from '@app/store/transactions/requests.hooks';
import { Link } from '@app/ui/components/link/link';

import { FeeForm } from './fee-form';
import { MinimalErrorMessage } from './minimal-error-message';
import { SubmitAction } from './submit-action';

interface StacksTransactionSignerProps {
  stacksTransaction: StacksTransaction;
  disableFeeSelection?: boolean;
  disableNonceSelection?: boolean;
  isMultisig: boolean;
  onCancel(): void;
  onSignStacksTransaction(fee: number, nonce: number): void;
}
export function StacksTransactionSigner({
  stacksTransaction,
  disableFeeSelection,
  disableNonceSelection,
  onSignStacksTransaction,
  isMultisig,
}: StacksTransactionSignerProps) {
  const transactionRequest = useTransactionRequestState();
  const { data: stxFees } = useCalculateStacksTxFees(stacksTransaction);
  const analytics = useAnalytics();
  const { data: stacksBalances } = useCurrentStacksAccountAnchoredBalances();
  const navigate = useNavigate();
  const { data: nextNonce } = useNextNonce();
  const { search } = useLocation();

  useRouteHeader(<PopupHeader />);

  useOnMount(() => {
    void analytics.track('view_transaction_signing'), [analytics];
  });

  const onSubmit = async (values: StacksTransactionFormValues) => {
    onSignStacksTransaction(stxToMicroStx(values.fee).toNumber(), Number(values.nonce));
  };

  if (!transactionRequest) return null;

  const validationSchema =
    !transactionRequest.sponsored && !disableFeeSelection && !isMultisig
      ? yup.object({
          fee: stxFeeValidator(stacksBalances?.stx.unlockedStx),
          nonce: nonceValidator,
        })
      : yup.object({
          nonce: nonceValidator,
        });

  const isNonceAlreadySet = !Number.isNaN(transactionRequest.nonce);

  const initialValues: StacksTransactionFormValues = {
    fee: '',
    feeCurrency: 'STX',
    feeType: FeeTypes[FeeTypes.Middle],
    nonce: isNonceAlreadySet ? transactionRequest.nonce : nextNonce?.nonce,
  };

  return (
    <Flex alignItems="center" flexDirection="column" p="space.05" width="100%">
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

            {!isNonceAlreadySet && <NonceSetter />}
            <FeeForm
              fees={stxFees}
              defaultFeeValue={Number(transactionRequest?.fee || 0)}
              disableFeeSelection={disableFeeSelection}
            />
            {!disableNonceSelection && (
              <Link
                alignSelf="flex-end"
                my="space.04"
                onClick={() => navigate(RouteUrls.EditNonce + search)}
              >
                Edit nonce
              </Link>
            )}
            <MinimalErrorMessage />
            <SubmitAction />
            <HighFeeDrawer learnMoreUrl={HIGH_FEE_WARNING_LEARN_MORE_URL_STX} />
            <Outlet />
          </>
        )}
      </Formik>
    </Flex>
  );
}
