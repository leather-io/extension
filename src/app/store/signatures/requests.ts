import { atom } from 'jotai';

import { getGenericSignaturePayloadFromToken } from '@app/common/signature/requests';

import { accountsWithAddressState } from '../accounts/accounts';

/**
 * @deprecated
 * Use hooks to pull in search param values
 */
export const signatureRequestToken = atom<null | string>(null);

/**
 * @deprecated
 * See root atom for more details
 */
const requestTokenPayloadState = atom(get => {
  const token = get(signatureRequestToken);
  if (!token) return null;
  return getGenericSignaturePayloadFromToken(token);
});

export const signatureRequestNetwork = atom(get => get(requestTokenPayloadState)?.network);

export const signatureRequestAccountIndex = atom(get => {
  const signaturePayload = get(requestTokenPayloadState);
  if (!signaturePayload?.stxAddress) return;
  const { stxAddress } = signaturePayload;
  const accounts = get(accountsWithAddressState);

  if (stxAddress && accounts) {
    return accounts.findIndex(account => account.address === stxAddress); // selected account
  }
  return undefined;
});
