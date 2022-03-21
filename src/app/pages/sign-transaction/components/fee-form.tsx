import { useEffect } from 'react';
import { useFormikContext } from 'formik';

import { LoadingRectangle } from '@app/components/loading-rectangle';
import { isTxSponsored, TransactionFormValues } from '@app/common/transactions/transaction-utils';
import { FeeRow } from '@app/components/fee-row/fee-row';
import { MinimalErrorMessage } from '@app/pages/sign-transaction/components/minimal-error-message';
import { useFeeEstimationsQuery } from '@app/query/fees/fees.hooks';
import {
  useUnsignedTxForSettingsState,
  useEstimatedUnsignedTransactionByteLengthState,
  useUnserializedSignedTransactionPayloadState,
} from '@app/store/transactions/transaction.hooks';
import { useFeeEstimationsState } from '@app/store/transactions/fees.hooks';
import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import {
  getDefaultSimulatedFeeEstimations,
  getFeeEstimationsWithMaxValues,
} from '@shared/transactions/fee-estimations';
import { useFeeEstimationsMaxValues } from '@app/common/transactions/use-fee-estimations-max-values';

export function FeeForm(): JSX.Element | null {
  const analytics = useAnalytics();
  const { setFieldValue } = useFormikContext<TransactionFormValues>();
  const serializedUnsignedTransactionPayloadState = useUnserializedSignedTransactionPayloadState();
  const estimatedUnsignedTxByteLength = useEstimatedUnsignedTransactionByteLengthState();
  const { data: feeEstimationsResp, isError } = useFeeEstimationsQuery(
    serializedUnsignedTransactionPayloadState,
    estimatedUnsignedTxByteLength
  );
  const transaction = useUnsignedTxForSettingsState();

  const isSponsored = transaction ? isTxSponsored(transaction) : false;

  const [, setFeeEstimations] = useFeeEstimationsState();
  const feeEstimationsMaxValues = useFeeEstimationsMaxValues();

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
          feeEstimationsResp.estimations,
          feeEstimationsMaxValues
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
        <FeeRow feeFieldName="fee" feeTypeFieldName="feeType" isSponsored={isSponsored} />
      ) : (
        <LoadingRectangle height="32px" width="100%" />
      )}
      <MinimalErrorMessage />
    </>
  );
}
