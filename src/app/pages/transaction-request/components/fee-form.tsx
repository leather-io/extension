import { useFormikContext } from 'formik';

import { LoadingRectangle } from '@app/components/loading-rectangle';
import {
  isTxSponsored,
  SendFormValues,
  TransactionFormValues,
} from '@app/common/transactions/transaction-utils';
import { FeeRow } from '@app/components/fee-row/fee-row';
import { MinimalErrorMessage } from '@app/pages/transaction-request/components/minimal-error-message';
import { useUnsignedPrepareTransactionDetails } from '@app/store/transactions/transaction.hooks';
import { FeeEstimate } from '@shared/models/fees-types';

interface FeeFormProps {
  feeEstimations: FeeEstimate[];
}
export function FeeForm({ feeEstimations }: FeeFormProps) {
  const { values } = useFormikContext<SendFormValues | TransactionFormValues>();
  const assetId = 'assetId' in values ? values.assetId : '';
  const transaction = useUnsignedPrepareTransactionDetails(assetId, values);

  const isSponsored = transaction ? isTxSponsored(transaction) : false;

  return (
    <>
      {feeEstimations.length ? (
        <FeeRow
          feeEstimations={feeEstimations}
          feeFieldName="fee"
          feeTypeFieldName="feeType"
          isSponsored={isSponsored}
        />
      ) : (
        <LoadingRectangle height="32px" width="100%" />
      )}
      <MinimalErrorMessage />
    </>
  );
}
