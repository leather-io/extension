import { AuthType, type StacksTransactionWire } from '@stacks/transactions';

import { createMoneyFromDecimal } from '@leather.io/utils';

import { useCheckSbtcSponsorshipEligible } from '@app/query/sbtc/sponsored-transactions.hooks';
import { useCalculateStacksTxFees } from '@app/query/stacks/fees/fees.hooks';

import { type Fee, type Fees } from '../fee-editor.context';
import { useStacksFees } from './use-stacks-fees';

interface StacksFees {
  fees: Fees;
  isLoading: boolean;
  isSponsored: boolean;
  getCustomFee(value: number): Fee;
}

interface StacksFeesLoaderProps {
  children({ fees, isLoading, isSponsored, getCustomFee }: StacksFees): React.JSX.Element;
  unsignedTx: StacksTransactionWire;
}
export function StacksFeesLoader({ children, unsignedTx }: StacksFeesLoaderProps) {
  const { data: stxFees, isLoading: isLoadingFees } = useCalculateStacksTxFees(unsignedTx);
  const fees = useStacksFees({ fees: stxFees });
  const { isVerifying: isVerifyingSbtcSponsorship, result: sbtcSponsorshipEligibility } =
    useCheckSbtcSponsorshipEligible({ baseTx: { transaction: unsignedTx }, stxFees });

  function getCustomFee(feeValue: number): Fee {
    return {
      priority: 'custom',
      feeValue,
      txFee: createMoneyFromDecimal(feeValue, 'STX'),
      time: '',
    };
  }

  if (!fees) return null;
  return children({
    fees,
    isLoading: isLoadingFees || isVerifyingSbtcSponsorship,
    isSponsored:
      sbtcSponsorshipEligibility?.isEligible || unsignedTx.auth.authType === AuthType.Sponsored,
    getCustomFee,
  });
}
