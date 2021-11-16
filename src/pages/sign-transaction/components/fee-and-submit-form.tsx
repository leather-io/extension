import React, { useEffect } from 'react';
import { useFormikContext } from 'formik';

import { microStxToStx } from '@common/stacks-utils';
import { LoadingRectangle } from '@components/loading-rectangle';
import { FeeRow } from '@features/fee-row/fee-row';
import { Estimations } from '@models/fees-types';
import { MinimalErrorMessage } from '@pages/sign-transaction/components/minimal-error-message';
import { SubmitAction } from '@pages/sign-transaction/components/submit-action';
import { useFeeEstimationsQuery } from '@query/fees/fees.hooks';
import {
  useEstimatedSignedTransactionByteLengthState,
  useSerializedSignedTransactionPayloadState,
} from '@store/transactions/transaction.hooks';
import {
  useFeeEstimationsState,
  useFeeRateState,
  useFeeState,
} from '@store/transactions/fees.hooks';

export function FeeAndSubmitForm(): JSX.Element | null {
  const { setFieldValue } = useFormikContext();
  const serializedSignedTransactionPayloadState = useSerializedSignedTransactionPayloadState();
  const estimatedSignedTxByteLength = useEstimatedSignedTransactionByteLengthState();
  const { data: feeEstimationsResp, isError } = useFeeEstimationsQuery(
    serializedSignedTransactionPayloadState,
    estimatedSignedTxByteLength
  );
  const [, setFeeEstimations] = useFeeEstimationsState();
  const [fee, setFee] = useFeeState();
  const [, setFeeRate] = useFeeRateState();

  useEffect(() => {
    if (!fee && feeEstimationsResp && feeEstimationsResp.estimations) {
      setFeeEstimations(feeEstimationsResp.estimations);
      setFee(feeEstimationsResp.estimations[Estimations.Middle].fee);
      setFeeRate(feeEstimationsResp.estimations[Estimations.Middle].fee_rate);
      setFieldValue('txFee', microStxToStx(feeEstimationsResp.estimations[Estimations.Middle].fee));
    }
  }, [fee, feeEstimationsResp, setFee, setFeeEstimations, setFeeRate, setFieldValue]);

  return (
    <>
      {feeEstimationsResp ? (
        <FeeRow feeEstimationsQueryError={isError || feeEstimationsResp?.error} />
      ) : (
        <LoadingRectangle height="32px" width="100%" />
      )}
      <MinimalErrorMessage />
      <SubmitAction />
    </>
  );
}
