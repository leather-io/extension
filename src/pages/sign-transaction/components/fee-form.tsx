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
import { useAnalytics } from '@common/hooks/analytics/use-analytics';

export function FeeForm(): JSX.Element | null {
  const analytics = useAnalytics();
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
        void analytics.track('use_fee_estimation_default_simulated');
      }
      if (feeEstimationsResp.estimations && feeEstimationsResp.estimations.length) {
        const feeEstimationsWithMaxValues = getFeeEstimationsWithMaxValues(
          feeEstimationsResp.estimations
        );
        setFeeEstimations(feeEstimationsWithMaxValues);
        void analytics.track('use_fee_estimation', {
          maxValues: feeEstimationsWithMaxValues,
          estimations: feeEstimationsResp.estimations,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
