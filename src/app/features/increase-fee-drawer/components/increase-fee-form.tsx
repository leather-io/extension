import { useCallback, useEffect } from 'react';
import * as yup from 'yup';
import { Formik } from 'formik';
import BigNumber from 'bignumber.js';
import { toast } from 'react-hot-toast';
import { Stack } from '@stacks/ui';

import { microStxToStx, stacksValue, stxToMicroStx } from '@app/common/stacks-utils';
import { useRefreshAllAccountData } from '@app/common/hooks/account/use-refresh-all-account-data';
import { useFeeSchema } from '@app/common/validation/use-fee-schema';
import { useWalletType } from '@app/common/use-wallet-type';
import { Caption } from '@app/components/typography';
import { TransactionItem } from '@app/components/transaction/components/transaction-item';
import { useLedgerNavigate } from '@app/features/ledger/hooks/use-ledger-navigate';
import { useRawDeserializedTxState, useRawTxIdState } from '@app/store/transactions/raw.hooks';
import { useReplaceByFeeSoftwareWalletSubmitCallBack } from '@app/store/transactions/fees.hooks';
import { safelyFormatHexTxid } from '@app/common/utils/safe-handle-txid';
import { useSubmittedTransactionsActions } from '@app/store/submitted-transactions/submitted-transactions.hooks';
import { LoadingSpinner } from '@app/components/loading-spinner';
import { useCurrentAccountAvailableStxBalance } from '@app/query/stacks/balance/balance.hooks';

import { IncreaseFeeActions } from './increase-fee-actions';
import { IncreaseFeeField } from './increase-fee-field';
import { useSelectedTx } from '../hooks/use-selected-tx';

export function IncreaseFeeForm(): JSX.Element | null {
  const refreshAccountData = useRefreshAllAccountData();
  const tx = useSelectedTx();
  const [, setTxId] = useRawTxIdState();
  const replaceByFee = useReplaceByFeeSoftwareWalletSubmitCallBack();
  const stxBalance = useCurrentAccountAvailableStxBalance();
  const submittedTransactionsActions = useSubmittedTransactionsActions();
  const feeSchema = useFeeSchema();
  const rawTx = useRawDeserializedTxState();
  const { whenWallet } = useWalletType();
  const ledgerNavigate = useLedgerNavigate();

  const fee = Number(rawTx?.auth.spendingCondition?.fee);

  useEffect(() => {
    if (tx?.tx_status !== 'pending' && rawTx) {
      setTxId(null);
      toast('Your transaction went through! No need to speed it up.');
    }
  }, [rawTx, tx?.tx_status, setTxId]);

  const onSubmit = useCallback(
    async values => {
      if (!tx || !rawTx) return;
      rawTx.setFee(stxToMicroStx(values.fee).toString());
      const txId = tx.tx_id || safelyFormatHexTxid(rawTx.txid());
      await refreshAccountData();
      submittedTransactionsActions.transactionReplacedByFee(txId);
      whenWallet({
        software: async () => {
          await replaceByFee(rawTx);
        },
        ledger: () => {
          ledgerNavigate.toConnectAndSignTransactionStep(rawTx, true);
        },
      })();
    },
    [
      tx,
      rawTx,
      refreshAccountData,
      submittedTransactionsActions,
      whenWallet,
      replaceByFee,
      ledgerNavigate,
    ]
  );

  if (!tx || !fee) return <LoadingSpinner />;

  return (
    <Formik
      initialValues={{ fee: new BigNumber(microStxToStx(fee)).toNumber() }}
      onSubmit={onSubmit}
      validateOnChange={false}
      validateOnBlur={false}
      validateOnMount={false}
      validationSchema={yup.object({ fee: feeSchema() })}
    >
      {() => (
        <Stack spacing="extra-loose">
          {tx && <TransactionItem position="relative" transaction={tx} zIndex={99} />}
          <Stack spacing="base">
            <IncreaseFeeField currentFee={fee} />
            {stxBalance && (
              <Caption>Balance: {stacksValue({ value: stxBalance, fixedDecimals: true })}</Caption>
            )}
          </Stack>
          <IncreaseFeeActions currentFee={fee} />
        </Stack>
      )}
    </Formik>
  );
}
