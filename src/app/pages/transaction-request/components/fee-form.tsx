import { useFormikContext } from 'formik';

import { StacksFeeEstimateLegacy } from '@shared/models/fees/_fees-legacy.model';
import { TransactionFormValues } from '@shared/models/form.model';

import { isTxSponsored } from '@app/common/transactions/stacks/transaction.utils';
import { FeeRow } from '@app/components/fee-row/fee-row';
import { LoadingRectangle } from '@app/components/loading-rectangle';
import { MinimalErrorMessage } from '@app/pages/transaction-request/components/minimal-error-message';
import { useUnsignedPrepareTransactionDetails } from '@app/store/transactions/transaction.hooks';

interface FeeFormProps {
  feeEstimations: StacksFeeEstimateLegacy[];
}
// TODO: The new FeesRow component should be used here when the legacy
// send form, and the legacy fee row, are removed.
export function FeeForm({ feeEstimations }: FeeFormProps) {
  const { values } = useFormikContext<TransactionFormValues>();
  const transaction = useUnsignedPrepareTransactionDetails(values);

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
