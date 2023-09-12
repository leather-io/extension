import { useFormikContext } from 'formik';

import { Fees } from '@shared/models/fees/fees.model';
import { StacksTransactionFormValues } from '@shared/models/form.model';

import { isTxSponsored } from '@app/common/transactions/stacks/transaction.utils';
import { FeesRow } from '@app/components/fees-row/fees-row';
import { LoadingRectangle } from '@app/components/loading-rectangle';
import { useUnsignedPrepareTransactionDetails } from '@app/store/transactions/transaction.hooks';

interface FeeFormProps {
  fees?: Fees;
  disableFeeSelection?: boolean;
  defaultFeeValue?: number;
}

export function FeeForm({ fees, disableFeeSelection, defaultFeeValue }: FeeFormProps) {
  const { values } = useFormikContext<StacksTransactionFormValues>();
  const transaction = useUnsignedPrepareTransactionDetails(values);

  const isSponsored = transaction ? isTxSponsored(transaction) : false;

  return (
    <>
      {fees?.estimates.length ? (
        <FeesRow
          disableFeeSelection={disableFeeSelection}
          defaultFeeValue={defaultFeeValue}
          fees={fees}
          isSponsored={isSponsored}
        />
      ) : (
        <LoadingRectangle height="32px" width="100%" />
      )}
    </>
  );
}
