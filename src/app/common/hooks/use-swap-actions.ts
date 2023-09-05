import { useMemo } from 'react';

import { useAppDispatch } from '@app/store';
import { swapsActions } from '@app/store/swap';

import { MagicInboundSwap } from '../magic/models';

export function useSwapActions() {
  const dispatch = useAppDispatch();

  return useMemo(
    () => ({
      createInboundMagicSwap(swap: MagicInboundSwap) {
        return dispatch(swapsActions.createInboundMagicSwap(swap));
      },
    }),
    [dispatch]
  );
}
