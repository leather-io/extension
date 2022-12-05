import { useFormikContext } from 'formik';

import { StacksFeeEstimate } from '@shared/models/fees/stacks-fees.model';
import { SendFormValues, TransactionFormValues } from '@shared/models/form.model';

import { isTxSponsored } from '@app/common/transactions/stacks/transaction.utils';
import { FeeRow } from '@app/components/fee-row/fee-row';
import { LoadingRectangle } from '@app/components/loading-rectangle';
import { MinimalErrorMessage } from '@app/pages/transaction-request/components/minimal-error-message';
import { useUnsignedPrepareTransactionDetails } from '@app/store/transactions/transaction.hooks';

interface FeeFormProps {
  feeEstimations: StacksFeeEstimate[];
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
