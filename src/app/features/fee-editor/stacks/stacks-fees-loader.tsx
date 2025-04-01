import { useAsync } from 'react-async-hook';

import {
  type StacksUnsignedTransactionOptions,
  generateStacksUnsignedTransaction,
} from '@leather.io/stacks';
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
  txOptions: StacksUnsignedTransactionOptions;
}
export function StacksFeesLoader({ children, txOptions }: StacksFeesLoaderProps) {
  const unsignedTx = useAsync(
    () => generateStacksUnsignedTransaction(txOptions),
    [txOptions]
  ).result;

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
