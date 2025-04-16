import { useMemo } from 'react';

import type { Fees } from '@leather.io/models';
import { convertAmountToBaseUnit } from '@leather.io/utils';

import { type Fees as StacksFees, feePriorityTimeMap } from '../fee-editor.context';

interface UseStacksFeesArgs {
  fees?: Fees;
}
export function useStacksFees({ fees }: UseStacksFeesArgs) {
  return useMemo<StacksFees | undefined>(() => {
    if (!fees) return;

    return {
      slow: {
        priority: 'slow',
        feeValue: convertAmountToBaseUnit(fees.estimates[0].fee).toNumber(),
        txFee: fees.estimates[0].fee,
        time: feePriorityTimeMap.slow,
      },
      standard: {
        priority: 'standard',
        feeValue: convertAmountToBaseUnit(fees.estimates[1].fee).toNumber(),
        txFee: fees.estimates[1].fee,
        time: feePriorityTimeMap.standard,
      },
      fast: {
        priority: 'fast',
        feeValue: convertAmountToBaseUnit(fees.estimates[2].fee).toNumber(),
        txFee: fees.estimates[2].fee,
        time: feePriorityTimeMap.fast,
      },
      // Load custom as standard fee
      custom: {
        priority: 'custom',
        feeValue: convertAmountToBaseUnit(fees.estimates[1].fee).toNumber(),
        txFee: fees.estimates[1].fee,
        time: feePriorityTimeMap.custom,
      },
    };
  }, [fees]);
}
