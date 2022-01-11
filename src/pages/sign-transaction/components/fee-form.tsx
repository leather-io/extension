import React, { useEffect } from 'react';
import { useFormikContext } from 'formik';

import { LoadingRectangle } from '@components/loading-rectangle';
import {
  getDefaultSimulatedFeeEstimations,
  getFeeEstimationsWithMaxValues,
  isTxSponsored,
  TransactionFormValues,
} from '@common/transactions/transaction-utils';
import { FeeRow } from '@components/fee-row/fee-row';
import { MinimalErrorMessage } from '@pages/sign-transaction/components/minimal-error-message';
import { useFeeEstimationsQuery } from '@query/fees/fees.hooks';
import {
  useUnsignedTxForSettingsState,
  useEstimatedUnsignedTransactionByteLengthState,
  useUnserializedSignedTransactionPayloadState,
} from '@store/transactions/transaction.hooks';
import { useFeeEstimationsState } from '@store/transactions/fees.hooks';

export function FeeForm(): JSX.Element | null {
  const { setFieldValue } = useFormikContext<TransactionFormValues>();
  const serializedUnsignedTransactionPayloadState = useUnserializedSignedTransactionPayloadState();
  const estimatedUnsignedTxByteLength = useEstimatedUnsignedTransactionByteLengthState();
  const { data: feeEstimationsResp, isError } = useFeeEstimationsQuery(
    serializedUnsignedTransactionPayloadState,
    estimatedUnsignedTxByteLength
  );
  const [transaction] = useUnsignedTxForSettingsState();

  const isSponsored = transaction ? isTxSponsored(transaction) : false;

  const [, setFeeEstimations] = useFeeEstimationsState();

  useEffect(() => {
    if (feeEstimationsResp) {
      if (
        (isError || !!feeEstimationsResp?.error || !feeEstimationsResp.estimations.length) &&
        estimatedUnsignedTxByteLength
      ) {
        setFeeEstimations(getDefaultSimulatedFeeEstimations(estimatedUnsignedTxByteLength));
      }
      if (feeEstimationsResp.estimations && feeEstimationsResp.estimations.length) {
        const feeEstimationsWithMaxValues = getFeeEstimationsWithMaxValues(
          feeEstimationsResp.estimations
        );
        setFeeEstimations(feeEstimationsWithMaxValues);
      }
    }
  }, [
    estimatedUnsignedTxByteLength,
    feeEstimationsResp,
    isError,
    setFeeEstimations,
    setFieldValue,
  ]);

  return (
    <>
      {feeEstimationsResp ? (
        <FeeRow fieldName="fee" isSponsored={isSponsored} />
      ) : (
        <LoadingRectangle height="32px" width="100%" />
      )}
      <MinimalErrorMessage />
    </>
  );
}
