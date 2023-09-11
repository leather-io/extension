import { useMemo } from 'react';

import { useAppDispatch } from '@app/store';
import { swapsActions } from '@app/store/swap';

import { MagicInboundSwap, MagicInboundSwapStatus } from '../magic/models';

export function useSwapActions() {
  const dispatch = useAppDispatch();

  return useMemo(
    () => ({
      createInboundMagicSwap(swap: Omit<MagicInboundSwap, 'status'>) {
        return dispatch(
          swapsActions.createInboundMagicSwap({
            status: MagicInboundSwapStatus.CREATED,
            ...swap,
          })
        );
      },
    }),
    [dispatch]
  );
}
