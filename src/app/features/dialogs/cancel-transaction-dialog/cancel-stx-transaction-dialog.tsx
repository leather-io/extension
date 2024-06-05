import { Suspense, useEffect } from 'react';
import { Outlet, useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import { microStxToStx, stxToMicroStx } from '@leather-wallet/utils';
import BigNumber from 'bignumber.js';
import { Formik } from 'formik';
import { Flex, Stack } from 'leather-styles/jsx';

import { RouteUrls } from '@shared/route-urls';

import { LoadingKeys, useLoading } from '@app/common/hooks/use-loading';
import { stacksValue } from '@app/common/stacks-utils';
import { FeesRow } from '@app/components/fees-row/fees-row';
import { LoadingSpinner } from '@app/components/loading-spinner';
import { StacksTransactionItem } from '@app/components/stacks-transaction-item/stacks-transaction-item';
import { useToast } from '@app/features/toasts/use-toast';
import { Dialog } from '@app/ui/components/containers/dialog/dialog';
import { Footer } from '@app/ui/components/containers/footers/footer';
import { DialogHeader } from '@app/ui/components/containers/headers/dialog-header';
import { Spinner } from '@app/ui/components/spinner';
import { Caption } from '@app/ui/components/typography/caption';

import { CancelTransactionActions } from './components/cancel-transaction-actions';
import { useStxCancelTransaction } from './hooks/use-stx-cancel-transaction';

export function CancelStxTransactionDialog() {
  const {
    rawTx,
    rawTxId,
    setRawTxId,
    tx,
    setTxId,
    onSubmit,
    validationSchema,
    availableUnlockedBalance,
    stxFees,
  } = useStxCancelTransaction();
  const { isLoading, setIsIdle } = useLoading(LoadingKeys.CANCEL_TRANSACTION_DRAWER);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const txIdFromParams = searchParams.get('txId');
  const toast = useToast();

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

  if (!tx || !fee) return <LoadingSpinner />;

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
        validateOnMount={true}
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
                  <CancelTransactionActions
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
                      <FeesRow fees={stxFees} defaultFeeValue={fee + 1} isSponsored={false} />
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
