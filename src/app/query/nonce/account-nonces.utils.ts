import { AddressNonces } from '@stacks/blockchain-api-client/lib/generated';
import { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';

export enum NonceTypes {
  apiSuggestedNonce = 'api-suggested-nonce',
  clientFallbackNonce = 'client-fallback-nonce',
  undefinedNonce = 'undefined-nonce',
}

function apiSuggestsImpossibleZeroNonceWithConfirmedTxs(
  confirmedTransactions: Transaction[],
  possibleNextNonce: number
) {
  return possibleNextNonce === 0 && confirmedTransactions.length > 0;
}

function compareApiMissingNoncesWithPendingTxsNonces(
  detectedMissingNonces: number[],
  lastPendingTxNonceIncremented: number,
  pendingTxsNonces: number[],
  possibleNextNonce: number,
  pendingTxsNoncesIncludesApiPossibleNextNonce: boolean
) {
  const remainingMissingNonces = detectedMissingNonces.filter(
    nonce => !pendingTxsNonces.includes(nonce)
  );
  return remainingMissingNonces.length > 0
    ? { nonce: Math.min(...remainingMissingNonces), nonceType: NonceTypes.apiSuggestedNonce }
    : pendingTxsNoncesIncludesApiPossibleNextNonce
    ? { nonce: lastPendingTxNonceIncremented, nonceType: NonceTypes.clientFallbackNonce }
    : { nonce: possibleNextNonce, nonceType: NonceTypes.apiSuggestedNonce };
}

function findAnyMissingPendingTxsNonces(pendingNonces: number[]) {
  const maxNonce = Math.max(...pendingNonces);
  const minNonce = Math.min(...pendingNonces);
  const missingNonces = [];

  for (let i = minNonce; i <= maxNonce; i++) {
    if (!pendingNonces.includes(i)) missingNonces.push(i);
  }
  return missingNonces;
}

export function getNextNonce(
  accountNonces: AddressNonces,
  confirmedTransactions: Transaction[],
  pendingTransactions: MempoolTransaction[]
): { nonce: number; nonceType: NonceTypes } {
  const detectedMissingNonces = accountNonces.detected_missing_nonces;
  const lastExecutedNonce = accountNonces.last_executed_tx_nonce;
  const possibleNextNonce = accountNonces.possible_next_nonce;

  const firstMissingNonce = detectedMissingNonces?.sort()[0];
  const pendingTxsNonces = pendingTransactions.map(tx => tx.nonce);
  const lastPendingTxNonce = pendingTransactions[0]?.nonce;
  const lastConfirmedTxNonceIncremented = confirmedTransactions[0]?.nonce + 1;
  const lastPendingTxNonceIncremented = lastPendingTxNonce + 1;
  const pendingTxsNoncesIncludesApiPossibleNextNonce = pendingTxsNonces.includes(possibleNextNonce);
  const pendingTxsMissingNonces = findAnyMissingPendingTxsNonces(pendingTxsNonces);
  const firstPendingMissingNonce = pendingTxsMissingNonces.sort()[0];

  const hasApiMissingNonces = detectedMissingNonces?.length > 0;
  const hasPendingTxs = pendingTransactions?.length > 0;
  const pendingTxsHasMissingNonces = pendingTxsMissingNonces.length > 0;
  const apiReturnsMissingNoncesAndPendingTransactions = hasApiMissingNonces && hasPendingTxs;
  const apiReturnsMissingNoncesButNoPendingTransactions = hasApiMissingNonces && !hasPendingTxs;
  const apiReturnsPendingTransactionsWithPossibleNextNonce =
    hasPendingTxs && pendingTxsNoncesIncludesApiPossibleNextNonce;
  const lastExecutedNonceIsNotTheFirstMissingNonce = lastExecutedNonce !== firstMissingNonce;

  if (apiSuggestsImpossibleZeroNonceWithConfirmedTxs(confirmedTransactions, possibleNextNonce))
    return {
      nonce: lastConfirmedTxNonceIncremented,
      nonceType: NonceTypes.clientFallbackNonce,
    };

  if (apiReturnsMissingNoncesAndPendingTransactions) {
    return compareApiMissingNoncesWithPendingTxsNonces(
      detectedMissingNonces,
      lastPendingTxNonceIncremented,
      pendingTxsNonces,
      possibleNextNonce,
      pendingTxsNoncesIncludesApiPossibleNextNonce
    );
  }

  if (apiReturnsMissingNoncesButNoPendingTransactions && lastExecutedNonceIsNotTheFirstMissingNonce)
    return { nonce: firstMissingNonce, nonceType: NonceTypes.apiSuggestedNonce };

  if (apiReturnsPendingTransactionsWithPossibleNextNonce) {
    if (pendingTxsHasMissingNonces)
      return {
        nonce: firstPendingMissingNonce,
        nonceType: NonceTypes.clientFallbackNonce,
      };
    return { nonce: lastPendingTxNonceIncremented, nonceType: NonceTypes.clientFallbackNonce };
  }

  return { nonce: possibleNextNonce, nonceType: NonceTypes.apiSuggestedNonce };
}
