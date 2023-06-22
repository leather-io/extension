import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import * as btc from '@scure/btc-signer';

import { undefinedIfLengthZero } from '@shared/utils';

import { useRejectIfLedgerWallet } from '@app/common/rpc-helpers';

import { useDefaultRequestParams } from '../hooks/use-default-request-search-params';

export function usePsbtRequestSearchParams() {
  const [searchParams] = useSearchParams();
  const { origin, tabId } = useDefaultRequestParams();
  const requestToken = searchParams.get('request');
  return useMemo(
    () => ({
      origin,
      tabId: tabId ?? 1,
      requestToken,
    }),
    [origin, requestToken, tabId]
  );
}

export function useRpcSignPsbtParams() {
  useRejectIfLedgerWallet('signPsbt');

  const [searchParams] = useSearchParams();
  const { origin, tabId } = useDefaultRequestParams();
  const requestId = searchParams.get('requestId');
  const psbtHex = searchParams.get('hex');
  const allowedSighash = searchParams.getAll('allowedSighash');
  const signAtIndex = searchParams.getAll('signAtIndex');

  if (!requestId || !psbtHex || !origin) throw new Error('Invalid params');

  return useMemo(
    () => ({
      origin,
      tabId: tabId ?? 0,
      requestId,
      psbtHex,
      allowedSighash: undefinedIfLengthZero(
        allowedSighash.map(h => Number(h)) as btc.SignatureHash[]
      ),
      signAtIndex: undefinedIfLengthZero(signAtIndex.map(h => Number(h))),
    }),
    [allowedSighash, origin, psbtHex, requestId, signAtIndex, tabId]
  );
}
