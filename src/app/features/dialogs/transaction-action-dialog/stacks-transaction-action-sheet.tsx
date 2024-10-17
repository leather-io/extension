import { Suspense } from 'react';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';

import BigNumber from 'bignumber.js';
import { Formik } from 'formik';
import { Flex, Stack } from 'leather-styles/jsx';

import { useStxAvailableUnlockedBalance } from '@leather.io/query';
import { Caption, Sheet, SheetHeader, Spinner } from '@leather.io/ui';
import { microStxToStx, stxToMicroStx } from '@leather.io/utils';

import { RouteUrls } from '@shared/route-urls';

import { stacksValue } from '@app/common/stacks-utils';
import { LoadingSpinner } from '@app/components/loading-spinner';
import { StacksTransactionItem } from '@app/components/stacks-transaction-item/stacks-transaction-item';
import type { StacksTransactionActionType } from '@app/features/stacks-transaction-request/hooks/use-stacks-broadcast-transaction';
import { useCurrentStacksAccountAddress } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';

import { TransactionActions } from './components/transaction-actions';
import { useStacksTransactionAction } from './hooks/use-stacks-transaction-action';

interface StacksTransactionActionSheetProps {
  description: string;
  FeeComponent: React.ComponentType<{ currentFee: number }>;
  routeUrl: string;
  title: string;
  actionType: StacksTransactionActionType;
  txid: string;
}

interface StacksTransactionActionSheetLoaderProps {
  children(txid: string): React.ReactNode;
}

export function StacksTransactionActionSheetLoader({
  children,
}: StacksTransactionActionSheetLoaderProps) {
  const { txid } = useParams();

  if (!txid) throw new Error('Transaction id should be provided');

  return children(txid);
}

export function StacksTransactionActionSheet({
  txid,
  title,
  description,
  routeUrl,
  actionType,
  FeeComponent,
}: StacksTransactionActionSheetProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const StacksAddress = useCurrentStacksAccountAddress();
  const availableUnlockedBalance = useStxAvailableUnlockedBalance(StacksAddress);

  const { rawTx, tx, onSubmit, validationSchema, isLoadingRawTx, isLoadingTx } =
    useStacksTransactionAction({ actionType, txid });

  if (isLoadingRawTx || isLoadingTx) return <LoadingSpinner />;
  if (!txid) return null;

  const fee = Number(rawTx?.auth.spendingCondition?.fee);

  const isCancel = actionType === 'cancel';
  const initialFee = isCancel ? fee + 1 : fee;

  return (
    <>
      <Formik
        initialValues={{ fee: new BigNumber(microStxToStx(initialFee)).toNumber() }}
        onSubmit={values => onSubmit()(values)}
        validateOnChange={false}
        validateOnBlur={false}
        validateOnMount={false}
        validationSchema={validationSchema}
      >
        {props => (
          <>
            <Sheet
              isShowing={location.pathname === routeUrl.replace(':txid', txid)}
              onClose={() => navigate(RouteUrls.Home)}
              header={<SheetHeader title={title} />}
              footer={
                <TransactionActions
                  isDisabled={stxToMicroStx(props.values.fee).isEqualTo(fee)}
                  isLoading={isLoadingRawTx || isLoadingTx}
                  onCancel={() => navigate(RouteUrls.Home)}
                />
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
                  <Caption>{description}</Caption>
                  <Stack gap="space.06">
                    {tx && <StacksTransactionItem transaction={tx} />}
                    <Stack gap="space.04">
                      <FeeComponent currentFee={initialFee} />
                      {availableUnlockedBalance?.amount && (
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
            </Sheet>
            <Outlet />
          </>
        )}
      </Formik>
    </>
  );
}
