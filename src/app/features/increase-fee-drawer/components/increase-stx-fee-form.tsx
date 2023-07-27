import { useCallback, useEffect } from 'react';
import { toast } from 'react-hot-toast';
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
import { useWalletType } from '@app/common/use-wallet-type';
import { safelyFormatHexTxid } from '@app/common/utils/safe-handle-txid';
import { stxFeeValidator } from '@app/common/validation/forms/fee-validators';
import { LoadingSpinner } from '@app/components/loading-spinner';
import { StacksTransactionItem } from '@app/components/stacks-transaction-item/stacks-transaction-item';
import { useLedgerNavigate } from '@app/features/ledger/hooks/use-ledger-navigate';
import { useCurrentStacksAccountAnchoredBalances } from '@app/query/stacks/balance/stx-balance.hooks';
import { useSubmittedTransactionsActions } from '@app/store/submitted-transactions/submitted-transactions.hooks';
import { useReplaceByFeeSoftwareWalletSubmitCallBack } from '@app/store/transactions/fees.hooks';
import { useRawDeserializedTxState, useRawTxIdState } from '@app/store/transactions/raw.hooks';
import { Caption } from '@app/ui/components/typography/caption';

import { useSelectedTx } from '../hooks/use-selected-tx';
import { IncreaseFeeActions } from './increase-fee-actions';
import { IncreaseFeeField } from './increase-fee-field';

export function IncreaseStxFeeForm() {
  const refreshAccountData = useRefreshAllAccountData();
  const tx = useSelectedTx();
  const navigate = useNavigate();
  const [, setTxId] = useRawTxIdState();
  const replaceByFee = useReplaceByFeeSoftwareWalletSubmitCallBack();
  const { data: balances } = useCurrentStacksAccountAnchoredBalances();
  const { availableBalance } = useStxBalance();
  const submittedTransactionsActions = useSubmittedTransactionsActions();
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
    async (values: any) => {
      if (!tx || !rawTx) return;
      rawTx.setFee(stxToMicroStx(values.fee).toString());
      const txId = tx.tx_id || safelyFormatHexTxid(rawTx.txid());
      await refreshAccountData();
      submittedTransactionsActions.transactionReplacedByFee(txId);
      await whenWallet({
        software: async () => {
          await replaceByFee(rawTx);
        },
        ledger: () => {
          ledgerNavigate.toConnectAndSignStacksTransactionStep(rawTx);
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
          {tx && <StacksTransactionItem position="relative" transaction={tx} zIndex={99} />}
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
