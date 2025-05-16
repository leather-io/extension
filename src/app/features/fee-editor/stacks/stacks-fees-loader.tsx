import type { StacksTransactionWire } from '@stacks/transactions';

import { createMoneyFromDecimal } from '@leather.io/utils';

import { useCalculateStacksTxFees } from '@app/query/stacks/fees/fees.hooks';

import { type Fee, type Fees } from '../fee-editor.context';
import { useStacksFees } from './use-stacks-fees';

interface StacksFees {
  fees: Fees;
  isLoading: boolean;
  getCustomFee(value: number): Fee;
}

interface StacksFeesLoaderProps {
  children({ fees, isLoading, getCustomFee }: StacksFees): React.JSX.Element;
  unsignedTx: StacksTransactionWire;
}
export function StacksFeesLoader({ children, unsignedTx }: StacksFeesLoaderProps) {
  const { data: stxFees, isLoading } = useCalculateStacksTxFees(unsignedTx);
  const fees = useStacksFees({ fees: stxFees });

  function getCustomFee(feeValue: number): Fee {
    return {
      priority: 'custom',
      feeValue,
      txFee: createMoneyFromDecimal(feeValue, 'STX'),
      time: '',
    };
  }

  if (!fees) return null;
  return children({ fees, isLoading, getCustomFee });
}
