import { getGenericSignaturePayloadFromToken } from '@app/common/signature/requests';
import { atom } from 'jotai';
import { accountsWithAddressState } from '../accounts';
import { atomWithParam } from '../utils/atom-with-params';

const requestTokenState = atomWithParam('signature?request', null);
const requestTokenPayloadState = atom(get => {
  const token = get(requestTokenState);
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
