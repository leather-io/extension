import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import BigNumber from 'bignumber.js';
import { Formik } from 'formik';
import { Stack } from 'leather-styles/jsx';
import * as yup from 'yup';

import { RouteUrls } from '@shared/route-urls';

import { useRefreshAllAccountData } from '@app/common/hooks/account/use-refresh-all-account-data';
import { useStxBalance } from '@app/common/hooks/balance/stx/use-stx-balance';
import { microStxToStx, stxToMicroStx } from '@app/common/money/unit-conversion';
import { stacksValue } from '@app/common/stacks-utils';
import { safelyFormatHexTxid } from '@app/common/utils/safe-handle-txid';
import { stxFeeValidator } from '@app/common/validation/forms/fee-validators';
import { LoadingSpinner } from '@app/components/loading-spinner';
import { StacksTransactionItem } from '@app/components/stacks-transaction-item/stacks-transaction-item';
import { useStacksBroadcastTransaction } from '@app/features/stacks-transaction-request/hooks/use-stacks-broadcast-transaction';
import { useToast } from '@app/features/toasts/use-toast';
import { useCurrentStacksAccountBalances } from '@app/query/stacks/balance/stx-balance.hooks';
import { useSubmittedTransactionsActions } from '@app/store/submitted-transactions/submitted-transactions.hooks';
import { useRawDeserializedTxState, useRawTxIdState } from '@app/store/transactions/raw.hooks';
import { Caption } from '@app/ui/components/typography/caption';

import { useSelectedTx } from '../hooks/use-selected-tx';
import { IncreaseFeeActions } from './increase-fee-actions';
import { IncreaseFeeField } from './increase-fee-field';

export function IncreaseStxFeeForm() {
  const toast = useToast();
  const refreshAccountData = useRefreshAllAccountData();
  const tx = useSelectedTx();
  const navigate = useNavigate();
  const [, setTxId] = useRawTxIdState();
  const { data: balances } = useCurrentStacksAccountBalances();
  const { availableBalance } = useStxBalance();
  const submittedTransactionsActions = useSubmittedTransactionsActions();
  const rawTx = useRawDeserializedTxState();
  const { stacksBroadcastTransaction } = useStacksBroadcastTransaction('STX');

  const fee = Number(rawTx?.auth.spendingCondition?.fee);

  useEffect(() => {
    if (tx?.tx_status !== 'pending' && rawTx) {
      setTxId(null);
      toast.info('Your transaction went through! No need to speed it up.');
    }
  }, [rawTx, tx?.tx_status, setTxId, toast]);

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

  const validationSchema = yup.object({ fee: stxFeeValidator(availableBalance) });

  return (
    <Formik
      initialValues={{ fee: new BigNumber(microStxToStx(fee)).toNumber() }}
      onSubmit={onSubmit}
      validateOnChange={false}
      validateOnBlur={false}
      validateOnMount={false}
      validationSchema={validationSchema}
    >
      {props => (
        <Stack gap="space.06">
          {tx && <StacksTransactionItem transaction={tx} />}
          <Stack gap="space.04">
            <IncreaseFeeField currentFee={fee} />
            {balances?.stx.unlockedStx.amount && (
              <Caption>
                Balance: {stacksValue({ value: availableBalance.amount, fixedDecimals: true })}
              </Caption>
            )}
          </Stack>
          <IncreaseFeeActions
            onCancel={() => {
              setTxId(null);
              navigate(RouteUrls.Home);
            }}
            isDisabled={stxToMicroStx(props.values.fee).isEqualTo(fee)}
          />
        </Stack>
      )}
    </Formik>
  );
}
