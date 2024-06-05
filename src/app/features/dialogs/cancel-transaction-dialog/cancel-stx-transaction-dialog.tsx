import { Suspense, useCallback, useEffect } from 'react';
import { Outlet, useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import { microStxToStx, stxToMicroStx } from '@leather-wallet/utils';
import BigNumber from 'bignumber.js';
import { Formik } from 'formik';
import { Flex, Stack } from 'leather-styles/jsx';
import * as yup from 'yup';

import { RouteUrls } from '@shared/route-urls';

import { useRefreshAllAccountData } from '@app/common/hooks/account/use-refresh-all-account-data';
import { LoadingKeys, useLoading } from '@app/common/hooks/use-loading';
import { stacksValue } from '@app/common/stacks-utils';
import { safelyFormatHexTxid } from '@app/common/utils/safe-handle-txid';
import { stxFeeValidator } from '@app/common/validation/forms/fee-validators';
import { FeesRow } from '@app/components/fees-row/fees-row';
import { LoadingSpinner } from '@app/components/loading-spinner';
import { StacksTransactionItem } from '@app/components/stacks-transaction-item/stacks-transaction-item';
import { IncreaseFeeActions } from '@app/features/dialogs/increase-fee-dialog/components/increase-fee-actions';
import { useStacksBroadcastTransaction } from '@app/features/stacks-transaction-request/hooks/use-stacks-broadcast-transaction';
import { useToast } from '@app/features/toasts/use-toast';
import { useCurrentStxAvailableUnlockedBalance } from '@app/query/stacks/balance/account-balance.hooks';
import { useCalculateStacksTxFees } from '@app/query/stacks/fees/fees.hooks';
import { useSubmittedTransactionsActions } from '@app/store/submitted-transactions/submitted-transactions.hooks';
import { useRawDeserializedTxState, useRawTxIdState } from '@app/store/transactions/raw.hooks';
import { useStxTokenTransferUnsignedTxState } from '@app/store/transactions/token-transfer.hooks';
import { Dialog } from '@app/ui/components/containers/dialog/dialog';
import { Footer } from '@app/ui/components/containers/footers/footer';
import { DialogHeader } from '@app/ui/components/containers/headers/dialog-header';
import { Spinner } from '@app/ui/components/spinner';
import { Caption } from '@app/ui/components/typography/caption';

import { useSelectedTx } from './hooks/use-selected-tx';

export function CancelStxTransactionDialog() {
  const [rawTxId, setRawTxId] = useRawTxIdState();
  const { isLoading, setIsIdle } = useLoading(LoadingKeys.INCREASE_FEE_DRAWER);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const txIdFromParams = searchParams.get('txId');
  const toast = useToast();
  const refreshAccountData = useRefreshAllAccountData();
  const tx = useSelectedTx();
  const [, setTxId] = useRawTxIdState();
  const availableUnlockedBalance = useCurrentStxAvailableUnlockedBalance();
  const submittedTransactionsActions = useSubmittedTransactionsActions();
  const rawTx = useRawDeserializedTxState();
  const { data: stxFees } = useCalculateStacksTxFees(rawTx);

  const { stacksBroadcastTransaction } = useStacksBroadcastTransaction({
    token: 'STX',
    isIncreaseFeeTransaction: true,
  });

  const fee = Number(rawTx?.auth.spendingCondition?.fee);

  useEffect(() => {
    if (tx?.tx_status !== 'pending' && rawTx) {
      setTxId(null);
      toast.info('Your transaction went through! Cancellation not possible.');
    }
  }, [rawTx, tx?.tx_status, setTxId, toast]);

  useEffect(() => {
    if (!rawTxId && txIdFromParams) {
      setRawTxId(txIdFromParams);
    }
    if (isLoading && !rawTxId) {
      setIsIdle();
    }
  }, [isLoading, rawTxId, setIsIdle, setRawTxId, txIdFromParams]);

  const onSubmit = useCallback(
    async (values: any) => {
      if (!tx || !rawTx) return;
      rawTx.setFee(stxToMicroStx(values.fee).toString());
      const txId = tx.tx_id || safelyFormatHexTxid(rawTx.txid());
      await refreshAccountData();
      submittedTransactionsActions.transactionReplacedByFee(txId);
      await stacksBroadcastTransaction(rawTx);
    },
    [tx, rawTx, refreshAccountData, submittedTransactionsActions, stacksBroadcastTransaction]
  );

  if (!tx || !fee) return <LoadingSpinner />;

  const validationSchema = yup.object({ fee: stxFeeValidator(availableUnlockedBalance) });

  const onClose = () => {
    setRawTxId(null);
    navigate(RouteUrls.Home);
  };

  return (
    <>
      <Formik
        initialValues={{ fee: new BigNumber(microStxToStx(fee)).toNumber() }}
        onSubmit={onSubmit}
        validateOnChange={false}
        validateOnBlur={false}
        validateOnMount={false}
        validationSchema={validationSchema}
      >
        {props => (
          <>
            <Dialog
              isShowing={location.pathname === RouteUrls.CancelStxTransaction}
              onClose={onClose}
              header={<DialogHeader title="Cancel transaction" />}
              footer={
                <Footer flexDirection="row">
                  <IncreaseFeeActions
                    onCancel={() => {
                      setTxId(null);
                      navigate(RouteUrls.Home);
                    }}
                    isDisabled={stxToMicroStx(props.values.fee).isEqualTo(fee)}
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
                    Canceling a transaction isn't guaranteed to work. A higher fee can help replace
                    the old transaction
                  </Caption>
                  <Stack gap="space.06">
                    {tx && <StacksTransactionItem transaction={tx} />}
                    <Stack gap="space.04">
                      <FeesRow fees={stxFees} defaultFeeValue={fee} isSponsored={false} />
                      {availableUnlockedBalance?.amount && (
                        <Caption>
                          Balance:
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
