import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import { AllowedSighashTypes } from '@shared/rpc/methods/sign-psbt';
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
      allowedSighash: payload?.allowedSighash
        ? undefinedIfLengthZero(payload.allowedSighash.map(h => Number(h)) as AllowedSighashTypes[])
        : undefined,
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
  const requestId = searchParams.get('requestId');
  const psbtHex = searchParams.get('hex');
  const allowedSighash = searchParams.getAll('allowedSighash');
  const signAtIndex = searchParams.getAll('signAtIndex');

  return useMemo(() => {
    return {
      origin,
      tabId: tabId ?? 0,
      requestId,
      psbtHex,
      allowedSighash: undefinedIfLengthZero(
        allowedSighash.map(h => Number(h)) as AllowedSighashTypes[]
      ),
      signAtIndex: undefinedIfLengthZero(ensureArray(signAtIndex).map(h => Number(h))),
    };
  }, [allowedSighash, origin, psbtHex, requestId, signAtIndex, tabId]);
}
