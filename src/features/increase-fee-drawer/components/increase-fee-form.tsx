import React, { useCallback, useEffect } from 'react';
import * as yup from 'yup';
import { Formik } from 'formik';
import BigNumber from 'bignumber.js';
import { toast } from 'react-hot-toast';
import { Stack } from '@stacks/ui';

import { useFeeSchema } from '@common/validation/use-fee-schema';
import { Caption } from '@components/typography';
import { microStxToStx, stacksValue, stxToMicroStx } from '@common/stacks-utils';
import { useRefreshAllAccountData } from '@common/hooks/account/use-refresh-all-account-data';
import { TxItem } from '@components/popup/tx-item';
import {
  useRawTxByteLengthState,
  useRawDeserializedTxState,
  useRawTxIdState,
} from '@store/transactions/raw.hooks';
import {
  useFeeRateState,
  useFeeState,
  useReplaceByFeeSubmitCallBack,
} from '@store/transactions/fees.hooks';
import { useCurrentAccountAvailableStxBalance } from '@store/accounts/account.hooks';

import { IncreaseFeeActions } from './increase-fee-actions';
import { IncreaseFeeField } from './increase-fee-field';
import { useSelectedTx } from '../hooks/use-selected-tx';

export function IncreaseFeeForm(): JSX.Element | null {
  const refreshAccountData = useRefreshAllAccountData();
  const [, setFeeRate] = useFeeRateState();
  const [, setFee] = useFeeState();
  const tx = useSelectedTx();
  const rawTx = useRawDeserializedTxState();
  const fee = rawTx?.auth.spendingCondition?.fee.toNumber() || 0;
  const byteSize = useRawTxByteLengthState();
  const [, setTxId] = useRawTxIdState();
  const schema = useFeeSchema();
  const handleSubmit = useReplaceByFeeSubmitCallBack();
  const stxBalance = useCurrentAccountAvailableStxBalance();

  useEffect(() => {
    // Set fee on mount
    setFee(fee);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (tx?.tx_status !== 'pending' && rawTx) {
      setTxId(null);
      toast('Your transaction went through! No need to speed it up.');
    }
  }, [rawTx, tx?.tx_status, setTxId]);

  const onSubmit = useCallback(
    async values => {
      if (!byteSize) return;
      // TODO: Revisit the need for this account refresh?
      await refreshAccountData();
      const newFeeRate = new BigNumber(stxToMicroStx(values.txFee)).dividedBy(byteSize);
      const feeRate = newFeeRate.toNumber();
      setFeeRate(feeRate);
      setFee(stxToMicroStx(values.txFee).toNumber());
      await handleSubmit(values);
    },
    [byteSize, handleSubmit, refreshAccountData, setFeeRate, setFee]
  );

  if (!tx || !rawTx) return null;

  return (
    <Formik
      initialValues={{ txFee: new BigNumber(microStxToStx(fee)).toNumber() }}
      onSubmit={onSubmit}
      validateOnChange={false}
      validateOnBlur={false}
      validateOnMount={false}
      validationSchema={yup.object({ txFee: schema() })}
    >
      {() => (
        <Stack spacing="extra-loose">
          {tx && <TxItem position="relative" zIndex={99} transaction={tx} />}
          <Stack spacing="base">
            <IncreaseFeeField />
            {stxBalance && (
              <Caption>Balance: {stacksValue({ value: stxBalance, fixedDecimals: true })}</Caption>
            )}
          </Stack>
          <IncreaseFeeActions />
        </Stack>
      )}
    </Formik>
  );
}
