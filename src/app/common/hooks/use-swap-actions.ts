import { useMemo } from 'react';

import { useAppDispatch } from '@app/store';
import { swapsActions } from '@app/store/swap';

import { Swap } from '../swaps';

export function useSwapActions() {
  const dispatch = useAppDispatch();

  return useMemo(
    () => ({
      createSwap(swap: Swap) {
        return dispatch(swapsActions.createSwap(swap));
      },
    }),
    [dispatch]
  );
}
