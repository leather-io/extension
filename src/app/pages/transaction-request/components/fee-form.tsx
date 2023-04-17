import { useFormikContext } from 'formik';

import { Fees } from '@shared/models/fees/fees.model';
import { StacksTransactionFormValues } from '@shared/models/form.model';

import { isTxSponsored } from '@app/common/transactions/stacks/transaction.utils';
import { FeesRow } from '@app/components/fees-row/fees-row';
import { LoadingRectangle } from '@app/components/loading-rectangle';
import { MinimalErrorMessage } from '@app/pages/transaction-request/components/minimal-error-message';
import { useUnsignedPrepareTransactionDetails } from '@app/store/transactions/transaction.hooks';

interface FeeFormProps {
  fees?: Fees;
}

export function FeeForm({ fees }: FeeFormProps) {
  const { values } = useFormikContext<StacksTransactionFormValues>();
  const transaction = useUnsignedPrepareTransactionDetails(values);

  const isSponsored = transaction ? isTxSponsored(transaction) : false;

  return (
    <>
      {fees?.estimates.length ? (
        <FeesRow allowCustom fees={fees} isSponsored={isSponsored} />
      ) : (
        <LoadingRectangle height="32px" width="100%" />
      )}
      <MinimalErrorMessage />
    </>
  );
}
