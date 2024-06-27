import { Suspense, useCallback, useEffect } from 'react';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';

import { type StacksTransaction } from '@stacks/transactions';
import BigNumber from 'bignumber.js';
import { Formik } from 'formik';
import { Flex, Stack } from 'leather-styles/jsx';
import * as yup from 'yup';

import {
  useStacksRawTransaction,
  useStxAvailableUnlockedBalance,
  useTransactionById,
} from '@leather.io/query';
import { Caption, Dialog, Spinner } from '@leather.io/ui';
import { microStxToStx, stxToMicroStx } from '@leather.io/utils';

import { RouteUrls } from '@shared/route-urls';

import { useRefreshAllAccountData } from '@app/common/hooks/account/use-refresh-all-account-data';
import { stacksValue } from '@app/common/stacks-utils';
import { safelyFormatHexTxid } from '@app/common/utils/safe-handle-txid';
import { stxFeeValidator } from '@app/common/validation/forms/fee-validators';
import { LoadingSpinner } from '@app/components/loading-spinner';
import { StacksTransactionItem } from '@app/components/stacks-transaction-item/stacks-transaction-item';
import { useStacksBroadcastTransaction } from '@app/features/stacks-transaction-request/hooks/use-stacks-broadcast-transaction';
import { useToast } from '@app/features/toasts/use-toast';
import { useCurrentStacksAccountAddress } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { useSubmittedTransactionsActions } from '@app/store/submitted-transactions/submitted-transactions.hooks';
import { Footer } from '@app/ui/components/containers/footers/footer';
import { DialogHeader } from '@app/ui/components/containers/headers/dialog-header';

import { IncreaseFeeActions } from './components/increase-fee-actions';
import { IncreaseFeeField } from './components/increase-fee-field';

export function IncreaseStxFeeDialog() {
  const navigate = useNavigate();
  const location = useLocation();
  const { txid } = useParams();
  const toast = useToast();
  const refreshAccountData = useRefreshAllAccountData();
  const { data: tx, isLoading: isLoadingTx } = useTransactionById(txid || '');
  const stxAddress = useCurrentStacksAccountAddress();
  const availableUnlockedBalance = useStxAvailableUnlockedBalance(stxAddress);
  const submittedTransactionsActions = useSubmittedTransactionsActions();
  const { isLoadingRawTx, rawTx } = useStacksRawTransaction(txid || '');
  const { stacksBroadcastTransaction } = useStacksBroadcastTransaction({
    token: 'STX',
    isIncreaseFeeTransaction: true,
  });

  useEffect(() => {
    if (tx && tx.tx_status !== 'pending') {
      toast.info('Your transaction went through! No need to speed it up.');
    }
  }, [toast, tx, tx?.tx_status]);

  const onSubmit = useCallback(
    async (values: any, rawTx?: StacksTransaction) => {
      if (!tx || !rawTx) return;
      rawTx.setFee(stxToMicroStx(values.fee).toString());
      const txid = tx.tx_id || safelyFormatHexTxid(rawTx.txid());
      await refreshAccountData();
      submittedTransactionsActions.transactionReplacedByFee(txid);
      await stacksBroadcastTransaction(rawTx);
    },
    [tx, refreshAccountData, submittedTransactionsActions, stacksBroadcastTransaction]
  );

  if (isLoadingRawTx || isLoadingTx) return <LoadingSpinner />;
  if (!txid) return null;

  const fee = Number(rawTx?.auth.spendingCondition?.fee);
  const validationSchema = yup.object({ fee: stxFeeValidator(availableUnlockedBalance) });

  return (
    <>
      <Formik
        initialValues={{ fee: new BigNumber(microStxToStx(fee)).toNumber() }}
        onSubmit={values => onSubmit(values, rawTx)}
        validateOnChange={false}
        validateOnBlur={false}
        validateOnMount={false}
        validationSchema={validationSchema}
      >
        {props => (
          <>
            <Dialog
              isShowing={location.pathname === RouteUrls.IncreaseStxFee.replace(':txid', txid)}
              onClose={() => navigate(RouteUrls.Home)}
              header={<DialogHeader title="Increase fee" />}
              footer={
                <Footer flexDirection="row">
                  <IncreaseFeeActions
                    isDisabled={stxToMicroStx(props.values.fee).isEqualTo(fee)}
                    isLoading={isLoadingRawTx || isLoadingTx}
                    onCancel={() => navigate(RouteUrls.Home)}
                  />
                </Footer>
              }
            >
              <Stack gap="space.05" px="space.05" pb="space.05">
                <Suspense
                  fallback={
                    <Flex alignItems="center" justifyContent="center" p="space.06">
                      <Spinner />
                    </Flex>
                  }
                >
                  <Caption>
                    If your transaction is pending for a long time, its fee might not be high enough
                    to be included in a block. Update the fee for a higher value and try again.
                  </Caption>
                  <Stack gap="space.06">
                    {tx && <StacksTransactionItem transaction={tx} />}
                    <Stack gap="space.04">
                      <IncreaseFeeField currentFee={fee} />
                      {availableUnlockedBalance.amount && (
                        <Caption>
                          Balance:{' '}
                          {stacksValue({
                            value: availableUnlockedBalance.amount,
                            fixedDecimals: true,
                          })}
                        </Caption>
                      )}
                    </Stack>
                  </Stack>
                </Suspense>
              </Stack>
            </Dialog>
            <Outlet />
          </>
        )}
      </Formik>
    </>
  );
}
