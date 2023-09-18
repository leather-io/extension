import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { AlexSDK, SponsoredTxError } from 'alex-sdk';

import { logger } from '@shared/logger';
import { RouteUrls } from '@shared/route-urls';

import { LoadingKeys, useLoading } from '@app/common/hooks/use-loading';
import { delay } from '@app/common/utils';

export function useAlexBroadcastSwap(alexSDK: AlexSDK) {
  const { setIsIdle } = useLoading(LoadingKeys.SUBMIT_SWAP_TRANSACTION);
  const navigate = useNavigate();

  return useCallback(
    async (txRaw: string) => {
      try {
        const txId = await alexSDK.broadcastSponsoredTx(txRaw);
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
    [alexSDK, navigate, setIsIdle]
  );
}
