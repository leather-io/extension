import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { delay } from '@leather-wallet/utils';
import { SponsoredTxError } from 'alex-sdk';

import { logger } from '@shared/logger';
import { RouteUrls } from '@shared/route-urls';
import { alex } from '@shared/utils/alex-sdk';

import { LoadingKeys, useLoading } from '@app/common/hooks/use-loading';

export function useAlexBroadcastSwap() {
  const { setIsIdle } = useLoading(LoadingKeys.SUBMIT_SWAP_TRANSACTION);
  const navigate = useNavigate();

  return useCallback(
    async (txRaw: string) => {
      try {
        const txId = await alex.broadcastSponsoredTx(txRaw);
        logger.info('transaction:', txId);
        await delay(1000);
        setIsIdle();
        navigate(RouteUrls.Activity);
      } catch (e) {
        setIsIdle();
        navigate(RouteUrls.SwapError, {
          state: {
            message: e instanceof (Error || SponsoredTxError) ? e.message : 'Unknown error',
            title: 'Failed to broadcast',
          },
        });
      }
    },
    [navigate, setIsIdle]
  );
}
