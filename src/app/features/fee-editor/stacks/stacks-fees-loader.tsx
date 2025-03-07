import { useMemo } from 'react';

import type { StacksTransactionWire } from '@stacks/transactions';

import { useCalculateStacksTxFees } from '@leather.io/query';
import { createMoney } from '@leather.io/utils';

import { type Fee, type Fees, feePriorityTimeMap } from '../fee-editor.context';

interface StacksFeesLoaderProps {
  children(
    fees: Fees | undefined,
    isLoading: boolean,
    getCustomFee: (rate: number) => Fee
  ): React.ReactNode;
  unsignedTx?: StacksTransactionWire;
}
export function StacksFeesLoader({ children, unsignedTx }: StacksFeesLoaderProps) {
  const { data: stxFees, isLoading } = useCalculateStacksTxFees(unsignedTx);

  const fees = useMemo<Fees | undefined>(() => {
    if (!stxFees) return;

    return {
      slow: {
        type: 'slow',
        feeRate: stxFees.estimates[0].feeRate,
        feeValue: stxFees.estimates[0].fee,
        time: feePriorityTimeMap.slow,
      },
      standard: {
        type: 'standard',
        feeRate: stxFees.estimates[1].feeRate,
        feeValue: stxFees.estimates[1].fee,
        time: feePriorityTimeMap.standard,
      },
      fast: {
        type: 'fast',
        feeRate: stxFees.estimates[2].feeRate,
        feeValue: stxFees.estimates[2].fee,
        time: feePriorityTimeMap.fast,
      },
      // Load custom as standard fee
      custom: {
        type: 'custom',
        feeRate: stxFees.estimates[1].feeRate,
        feeValue: stxFees.estimates[1].fee,
        time: feePriorityTimeMap.custom,
      },
    };
  }, [stxFees]);

  function getCustomFee(feeRate: number): Fee {
    return {
      type: 'custom',
      feeRate,
      feeValue: createMoney(feeRate, 'STX'), // * tx size,
      time: '',
    };
  }

  return children(fees, isLoading, getCustomFee);
}
