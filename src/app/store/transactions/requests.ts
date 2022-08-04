import { atom } from 'jotai';

import { atomWithParam } from '@app/store/utils/atom-with-params';
import { getPayloadFromToken } from '@app/store/transactions/utils';

export const requestTokenState = atomWithParam('transaction?request', null);

export const requestTokenPayloadState = atom(get => {
  const token = get(requestTokenState);
  if (!token) return null;
  return getPayloadFromToken(token);
});

export const transactionRequestValidationState = atom(async _get => {
  // const requestToken = get(requestTokenState);
  // const wallet = get(walletState);
  // const origin = get(requestTokenOriginState);
  // if (!origin || !wallet || !requestToken) return;
  // try {
  //   const valid = await verifyTxRequest({
  //     requestToken,
  //     wallet,
  //     appDomain: origin,
  //   });
  //   return !!valid;
  // } catch (e) {
  //   return false;
  // }
  return true;
});

export const transactionRequestStxAddressState = atom(
  get => get(requestTokenPayloadState)?.stxAddress
);

// TODO
export const transactionRequestNetwork = atom(get => get(requestTokenPayloadState)?.network);
