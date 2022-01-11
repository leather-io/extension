import React, { useCallback, useEffect } from 'react';
import * as yup from 'yup';
import { Formik } from 'formik';
import BigNumber from 'bignumber.js';
import BN from 'bn.js';
import { toast } from 'react-hot-toast';
import { Stack } from '@stacks/ui';

import { microStxToStx, stacksValue, stxToMicroStx } from '@common/stacks-utils';
import { useRefreshAllAccountData } from '@common/hooks/account/use-refresh-all-account-data';
import { useFeeSchema } from '@common/validation/use-fee-schema';
import { Caption } from '@components/typography';
import { TxItem } from '@components/tx-item';
import { useRawDeserializedTxState, useRawTxIdState } from '@store/transactions/raw.hooks';
import { useReplaceByFeeSubmitCallBack } from '@store/transactions/fees.hooks';
import { useCurrentAccountAvailableStxBalance } from '@store/accounts/account.hooks';
import { useRemoveLocalSubmittedTxById } from '@store/accounts/account-activity.hooks';

import { IncreaseFeeActions } from './increase-fee-actions';
import { IncreaseFeeField } from './increase-fee-field';
import { useSelectedTx } from '../hooks/use-selected-tx';

export function IncreaseFeeForm(): JSX.Element | null {
  const refreshAccountData = useRefreshAllAccountData();
  const tx = useSelectedTx();
  const [, setTxId] = useRawTxIdState();
  const replaceByFee = useReplaceByFeeSubmitCallBack();
  const stxBalance = useCurrentAccountAvailableStxBalance();
  const removeLocallySubmittedTx = useRemoveLocalSubmittedTxById();
  const feeSchema = useFeeSchema();
  const rawTx = useRawDeserializedTxState();

  const fee = Number(rawTx?.auth.spendingCondition?.fee);

  useEffect(() => {
    if (tx?.tx_status !== 'pending' && rawTx) {
      setTxId(null);
      toast('Your transaction went through! No need to speed it up.');
    }
  }, [rawTx, tx?.tx_status, setTxId]);

  const onSubmit = useCallback(
    async values => {
      if (!rawTx) return;
      rawTx.setFee(new BN(stxToMicroStx(values.fee).toNumber()));
      // TODO: Revisit the need for this account refresh?
      await refreshAccountData();
      await replaceByFee(values);
      if (tx?.tx_id) {
        removeLocallySubmittedTx(tx.tx_id);
      }
    },
    [rawTx, refreshAccountData, removeLocallySubmittedTx, replaceByFee, tx]
  );

  if (!tx || !fee) return null;

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
          {tx && <TxItem position="relative" zIndex={99} transaction={tx} />}
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
