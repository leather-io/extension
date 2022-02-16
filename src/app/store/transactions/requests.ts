import { atom } from 'jotai';

import { logger } from '@shared/logger';
import { verifyTxRequest } from '@app/common/transactions/requests';
import { getRequestOrigin, StorageKey } from '@shared/utils/storage';
import { atomWithParam } from '@app/store/utils/atom-with-params';
import { getPayloadFromToken } from '@app/store/transactions/utils';
import { softwareWalletState } from '@app/store/wallet/wallet';

export const requestTokenState = atomWithParam('transaction?request', null);

export const requestTokenPayloadState = atom(get => {
  const token = get(requestTokenState);
  if (!token) return null;
  return getPayloadFromToken(token);
});

export const requestTokenOriginState = atom(get => {
  const token = get(requestTokenState);
  if (!token) return;
  try {
    return getRequestOrigin(StorageKey.transactionRequests, token);
  } catch (e) {
    logger.error(e);
    return false;
  }
});

export const transactionRequestValidationState = atom(async get => {
  const requestToken = get(requestTokenState);
  const wallet = get(softwareWalletState);
  const origin = get(requestTokenOriginState);
  if (!origin || !wallet || !requestToken) return;
  try {
    const valid = await verifyTxRequest({
      requestToken,
      wallet,
      appDomain: origin,
    });
    return !!valid;
  } catch (e) {
    return false;
  }
});

export const transactionRequestStxAddressState = atom(
  get => get(requestTokenPayloadState)?.stxAddress
);

export const transactionRequestNetwork = atom(get => get(requestTokenPayloadState)?.network);
