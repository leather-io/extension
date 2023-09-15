import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import { ensureArray, undefinedIfLengthZero } from '@shared/utils';

import { useRejectIfLedgerWallet } from '@app/common/rpc-helpers';

import { useDefaultRequestParams } from '../hooks/use-default-request-search-params';
import { getPsbtPayloadFromToken } from './requests';

export function usePsbtRequestSearchParams() {
  const [searchParams] = useSearchParams();
  const { origin, tabId } = useDefaultRequestParams();
  const requestToken = searchParams.get('request');

  if (!requestToken) throw new Error('Cannot decode psbt without request token');

  const payload = getPsbtPayloadFromToken(requestToken);

  return useMemo(
    () => ({
      appName: payload?.appDetails?.name,
      origin,
      payload,
      requestToken,
      signAtIndex: payload?.signAtIndex
        ? undefinedIfLengthZero(ensureArray(payload?.signAtIndex).map(h => Number(h)))
        : undefined,
      tabId: tabId ?? 1,
    }),
    [origin, payload, requestToken, tabId]
  );
}

export function useRpcSignPsbtParams() {
  useRejectIfLedgerWallet('signPsbt');

  const [searchParams] = useSearchParams();
  const { origin, tabId } = useDefaultRequestParams();
  const broadcast = searchParams.get('broadcast');
  const psbtHex = searchParams.get('hex');
  const requestId = searchParams.get('requestId');
  const signAtIndex = searchParams.getAll('signAtIndex');

  return useMemo(() => {
    return {
      broadcast: broadcast === 'true',
      origin,
      psbtHex,
      requestId,
      signAtIndex: undefinedIfLengthZero(ensureArray(signAtIndex).map(h => Number(h))),
      tabId: tabId ?? 0,
    };
  }, [broadcast, origin, psbtHex, requestId, signAtIndex, tabId]);
}
