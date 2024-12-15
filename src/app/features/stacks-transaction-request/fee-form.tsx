import { useFormikContext } from 'formik';

import type { Fees } from '@leather.io/models';

import { StacksTransactionFormValues } from '@shared/models/form.model';

import { isTxSponsored } from '@app/common/transactions/stacks/transaction.utils';
import { FeesRow } from '@app/components/fees-row/fees-row';
import { LoadingRectangle } from '@app/components/loading-rectangle';
import type { SbtcSponsorshipEligibility } from '@app/query/sbtc/sponsored-transactions.query';
import { useUnsignedPrepareTransactionDetails } from '@app/store/transactions/transaction.hooks';

interface FeeFormProps {
  fees?: Fees;
  disableFeeSelection?: boolean;
  defaultFeeValue?: number;
  sbtcSponsorshipEligibility?: SbtcSponsorshipEligibility;
}

export function FeeForm({
  fees,
  disableFeeSelection,
  defaultFeeValue,
  sbtcSponsorshipEligibility,
}: FeeFormProps) {
  const { values } = useFormikContext<StacksTransactionFormValues>();
  const transaction = useUnsignedPrepareTransactionDetails(values);
  const isSponsored = transaction ? isTxSponsored(transaction) : false;

  return (
    <>
      {!!sbtcSponsorshipEligibility && fees?.estimates.length ? (
        <FeesRow
          disableFeeSelection={disableFeeSelection}
          defaultFeeValue={defaultFeeValue}
          fees={fees}
          isSponsored={sbtcSponsorshipEligibility?.isEligible || isSponsored}
        />
      ) : (
        <LoadingRectangle height="32px" width="100%" />
      )}
    </>
  );
}
