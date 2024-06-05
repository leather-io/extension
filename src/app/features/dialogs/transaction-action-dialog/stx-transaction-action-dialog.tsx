import { Suspense } from 'react';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';

import type { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';
import type { StacksTransaction } from '@stacks/transactions';
import BigNumber from 'bignumber.js';
import { Formik } from 'formik';
import { Flex, Stack } from 'leather-styles/jsx';
import type { ObjectSchema } from 'yup';

import type { Money } from '@leather.io/models';
import { Caption, Spinner } from '@leather.io/ui';
import { microStxToStx, stxToMicroStx } from '@leather.io/utils';

import { RouteUrls } from '@shared/route-urls';

import { stacksValue } from '@app/common/stacks-utils';
import { LoadingSpinner } from '@app/components/loading-spinner';
import { StacksTransactionItem } from '@app/components/stacks-transaction-item/stacks-transaction-item';
import { Dialog } from '@app/ui/components/containers/dialog/dialog';
import { Footer } from '@app/ui/components/containers/footers/footer';
import { DialogHeader } from '@app/ui/components/containers/headers/dialog-header';

import { TransactionActions } from './components/transaction-actions';

interface IStxTransactionActionHookReturn {
  availableUnlockedBalance: Money;
  isLoadingRawTx: boolean;
  isLoadingTx: boolean;
  onSubmit(values: any, rawTx?: StacksTransaction): Promise<void>;
  rawTx: StacksTransaction | undefined;
  tx: MempoolTransaction | Transaction | undefined;
  validationSchema: ObjectSchema<{
    fee: number | undefined;
  }>;
}

interface StxTransactionActionDialogProps {
  description: string;
  FeeComponent: React.ComponentType<any>;
  isCancel?: boolean;
  routeUrl: string;
  title: string;
  useActionHook(txid?: string): IStxTransactionActionHookReturn;
}

export function StxTransactionActionDialog({
  title,
  description,
  routeUrl,
  useActionHook,
  FeeComponent,
  isCancel = false,
}: StxTransactionActionDialogProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { txid } = useParams();

  const {
    rawTx,
    tx,
    onSubmit,
    validationSchema,
    availableUnlockedBalance,
    isLoadingRawTx,
    isLoadingTx,
  } = useActionHook(txid);

  if (isLoadingRawTx || isLoadingTx) return <LoadingSpinner />;
  if (!txid) return null;

  const fee = Number(rawTx?.auth.spendingCondition?.fee);

  const initialFee = isCancel ? fee + 1 : fee;

  return (
    <>
      <Formik
        initialValues={{ fee: new BigNumber(microStxToStx(initialFee)).toNumber() }}
        onSubmit={values => onSubmit(values, rawTx)}
        validateOnChange={false}
        validateOnBlur={false}
        validateOnMount={false}
        validationSchema={validationSchema}
      >
        {props => (
          <>
            <Dialog
              isShowing={location.pathname === routeUrl.replace(':txid', txid)}
              onClose={() => navigate(RouteUrls.Home)}
              header={<DialogHeader title={title} />}
              footer={
                <Footer flexDirection="row">
                  <TransactionActions
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
            </Dialog>
            <Outlet />
          </>
        )}
      </Formik>
    </>
  );
}
