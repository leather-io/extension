import { atom } from 'jotai';
import { getPayloadFromToken } from '@store/transactions/utils';
import { walletState } from '@store/wallet/wallet';
import { verifyTxRequest } from '@common/transactions/requests';
import { getRequestOrigin, StorageKey } from '@common/storage';
import { atomWithParam } from '@store/utils/atom-with-params';
import { signedStacksTransactionBaseState } from '@store/transactions/index';
import BigNumber from 'bignumber.js';
import { isNumber, isString } from '@common/utils';

function safelyExtractFeeValue(fee: unknown) {
  if (fee === '') return undefined;
  if (!isNumber(fee) && !isString(fee)) return undefined;
  if (!Number.isFinite(parseInt(String(fee)))) return undefined;
  return new BigNumber(fee, 10);
}

export const requestTokenState = atomWithParam('transaction?request', null);

export const requestTokenPayloadState = atom(get => {
  const token = get(requestTokenState);
  if (!token) return;
  return getPayloadFromToken(token);
});

export const requestTokenOriginState = atom(get => {
  const token = get(requestTokenState);
  if (!token) return;
  try {
    return getRequestOrigin(StorageKey.transactionRequests, token);
  } catch (e) {
    console.error(e);
    return false;
  }
});

export const transactionRequestValidationState = atom(async get => {
  const requestToken = get(requestTokenState);
  const wallet = get(walletState);
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

export const transactionRequestCustomFeeState = atom(get =>
  safelyExtractFeeValue(get(requestTokenPayloadState)?.fee)
);

export const transactionRequestCustomFeeRateState = atom(get => {
  const appFee = get(transactionRequestCustomFeeState);
  if (!appFee) return;
  const { transaction } = get(signedStacksTransactionBaseState);
  if (!transaction) return;
  const byteSize = transaction?.serialize().byteLength || 0;
  const newFeeRate = new BigNumber(appFee.toNumber()).dividedBy(byteSize);
  return newFeeRate.toNumber();
});

export const transactionRequestNetwork = atom(get => get(requestTokenPayloadState)?.network);

requestTokenPayloadState.debugLabel = 'requestTokenPayloadState';
requestTokenOriginState.debugLabel = 'requestTokenOriginState';
transactionRequestValidationState.debugLabel = 'transactionRequestValidationState';
transactionRequestStxAddressState.debugLabel = 'transactionRequestStxAddressState';
transactionRequestNetwork.debugLabel = 'transactionRequestNetwork';
