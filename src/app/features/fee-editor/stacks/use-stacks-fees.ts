import { useMemo } from 'react';

import type { Fees } from '@leather.io/models';
import { convertAmountToBaseUnit } from '@leather.io/utils';

import { type Fees as StacksFees } from '../fee-editor.context';

const stacksFeePriorityTimeMap = {
  slow: '1–2 minutes',
  standard: '20–30 seconds',
  fast: '10 seconds',
  custom: '',
} as const;

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
        time: stacksFeePriorityTimeMap.slow,
      },
      standard: {
        priority: 'standard',
        feeValue: convertAmountToBaseUnit(fees.estimates[1].fee).toNumber(),
        txFee: fees.estimates[1].fee,
        time: stacksFeePriorityTimeMap.standard,
      },
      fast: {
        priority: 'fast',
        feeValue: convertAmountToBaseUnit(fees.estimates[2].fee).toNumber(),
        txFee: fees.estimates[2].fee,
        time: stacksFeePriorityTimeMap.fast,
      },
      // Load custom as standard fee
      custom: {
        priority: 'custom',
        feeValue: convertAmountToBaseUnit(fees.estimates[1].fee).toNumber(),
        txFee: fees.estimates[1].fee,
        time: stacksFeePriorityTimeMap.custom,
      },
    };
  }, [fees]);
}
