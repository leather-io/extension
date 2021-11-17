import React, { useEffect } from 'react';

import { LoadingRectangle } from '@components/loading-rectangle';
import { FeeRow } from '@features/fee-row/fee-row';
import { MinimalErrorMessage } from '@pages/sign-transaction/components/minimal-error-message';
import { SubmitAction } from '@pages/sign-transaction/components/submit-action';
import { useFeeEstimationsQuery } from '@query/fees/fees.hooks';
import {
  useEstimatedSignedTransactionByteLengthState,
  useSerializedSignedTransactionPayloadState,
} from '@store/transactions/transaction.hooks';
import { useFeeEstimationsState, useFeeState } from '@store/transactions/fees.hooks';

export function FeeAndSubmitForm(): JSX.Element | null {
  const serializedSignedTransactionPayloadState = useSerializedSignedTransactionPayloadState();
  const estimatedSignedTxByteLength = useEstimatedSignedTransactionByteLengthState();
  const { data: feeEstimationsResp, isError } = useFeeEstimationsQuery(
    serializedSignedTransactionPayloadState,
    estimatedSignedTxByteLength
  );
  const [, setFeeEstimations] = useFeeEstimationsState();
  const [fee] = useFeeState();

  useEffect(() => {
    if (!fee && feeEstimationsResp && feeEstimationsResp.estimations) {
      setFeeEstimations(feeEstimationsResp.estimations);
    }
  }, [fee, feeEstimationsResp, setFeeEstimations]);

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
