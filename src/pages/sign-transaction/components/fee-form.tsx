import React, { useEffect } from 'react';
import { useFormikContext } from 'formik';

import { microStxToStx } from '@common/stacks-utils';
import { LoadingRectangle } from '@components/loading-rectangle';
import { FeeRow } from '@features/fee-row/fee-row';
import { Estimations } from '@models/fees-types';
import { MinimalErrorMessage } from '@pages/sign-transaction/components/minimal-error-message';
import { useFeeEstimationsQuery } from '@query/fees/fees.hooks';
import {
  useEstimatedSignedTransactionByteLengthState,
  useSerializedSignedTransactionPayloadState,
} from '@store/transactions/transaction.hooks';
import { useFeeEstimationsState, useFeeState } from '@store/transactions/fees.hooks';

export function FeeForm(): JSX.Element | null {
  const { setFieldValue } = useFormikContext();
  const serializedSignedTransactionPayloadState = useSerializedSignedTransactionPayloadState();
  const estimatedSignedTxByteLength = useEstimatedSignedTransactionByteLengthState();
  const { data: feeEstimationsResp, isError } = useFeeEstimationsQuery(
    serializedSignedTransactionPayloadState,
    estimatedSignedTxByteLength
  );
  const [, setFeeEstimations] = useFeeEstimationsState();
  const [fee, setFee] = useFeeState();

  useEffect(() => {
    if (!fee && feeEstimationsResp && feeEstimationsResp.estimations) {
      setFeeEstimations(feeEstimationsResp.estimations);
      setFee(feeEstimationsResp.estimations[Estimations.Middle].fee);
      setFieldValue('txFee', microStxToStx(feeEstimationsResp.estimations[Estimations.Middle].fee));
    }
  }, [fee, feeEstimationsResp, setFee, setFeeEstimations, setFieldValue]);

  return (
    <>
      {feeEstimationsResp ? (
        <FeeRow feeEstimationsQueryError={isError || feeEstimationsResp?.error} />
      ) : (
        <LoadingRectangle height="32px" width="100%" />
      )}
      <MinimalErrorMessage />
    </>
  );
}
