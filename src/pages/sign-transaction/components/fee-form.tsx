import React, { useEffect } from 'react';
import { useFormikContext } from 'formik';

import { stacksValue } from '@common/stacks-utils';
import { LoadingRectangle } from '@components/loading-rectangle';
import { TransactionFormValues } from '@common/transactions/transaction-utils';
import { FeeRow } from '@features/fee-row/fee-row';
import { Estimations } from '@models/fees-types';
import { MinimalErrorMessage } from '@pages/sign-transaction/components/minimal-error-message';
import { useFeeEstimationsQuery } from '@query/fees/fees.hooks';
import {
  useEstimatedSignedTransactionByteLengthState,
  useSerializedSignedTransactionPayloadState,
} from '@store/transactions/transaction.hooks';
import { useFeeEstimationsState } from '@store/transactions/fees.hooks';

export function FeeForm(): JSX.Element | null {
  const { setFieldValue } = useFormikContext<TransactionFormValues>();
  const serializedSignedTransactionPayloadState = useSerializedSignedTransactionPayloadState();
  const estimatedSignedTxByteLength = useEstimatedSignedTransactionByteLengthState();
  const { data: feeEstimationsResp, isError } = useFeeEstimationsQuery(
    serializedSignedTransactionPayloadState,
    estimatedSignedTxByteLength
  );
  const [, setFeeEstimations] = useFeeEstimationsState();

  useEffect(() => {
    if (feeEstimationsResp && feeEstimationsResp.estimations) {
      setFeeEstimations(feeEstimationsResp.estimations);
      setFieldValue(
        'fee',
        stacksValue({
          fixedDecimals: true,
          value: feeEstimationsResp.estimations[Estimations.Middle].fee,
          withTicker: false,
        })
      );
    }
  }, [feeEstimationsResp, setFeeEstimations, setFieldValue]);

  return (
    <>
      {feeEstimationsResp ? (
        <FeeRow feeEstimationsError={isError || !!feeEstimationsResp?.error} />
      ) : (
        <LoadingRectangle height="32px" width="100%" />
      )}
      <MinimalErrorMessage />
    </>
  );
}
