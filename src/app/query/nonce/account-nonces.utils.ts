import toast from 'react-hot-toast';
import { AddressNonces } from '@stacks/blockchain-api-client/lib/generated';
import { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';

export function getNextNonce(
  accountNonces: AddressNonces,
  confirmedTransactions: Transaction[],
  pendingTransactions: MempoolTransaction[]
) {
  const lastExecutedNonce = accountNonces.last_executed_tx_nonce;
  const possibleNextNonce = accountNonces.possible_next_nonce;

  const detectedMissingNonces = accountNonces.detected_missing_nonces;
  const hasMissingNonces = detectedMissingNonces?.length > 0;
  const firstMissingNonce = detectedMissingNonces?.sort()[0];

  const hasPendingTxs = pendingTransactions?.length > 0;
  const pendingNonces = pendingTransactions.map(tx => tx.nonce);
  const lastPendingTxNonce = pendingTransactions[0]?.nonce;

  const pendingNoncesIncludesPossibleNextNonceFromApi = pendingNonces.includes(possibleNextNonce);

  // Validate if a 0 nonce is suggested that there are no confirmed transactions
  if (possibleNextNonce === 0 && confirmedTransactions.length > 0)
    return confirmedTransactions[0]?.nonce + 1;

  // We need to compare missing nonces with pending tx nonces
  // bc the api is often slow to update the missing nonces array
  if (hasMissingNonces && hasPendingTxs) {
    const remainingMissingNonces = detectedMissingNonces.filter(
      nonce => !pendingNonces.includes(nonce)
    );
    return remainingMissingNonces.length > 0
      ? Math.min(...remainingMissingNonces)
      : pendingNoncesIncludesPossibleNextNonceFromApi
      ? lastPendingTxNonce + 1
      : possibleNextNonce;
  }

  // If there is a missing nonce but no pending txs (and as a validation check, it is not
  // equal to the last executed nonce), just return the first missing nonce
  if (hasMissingNonces && !hasPendingTxs && lastExecutedNonce !== firstMissingNonce)
    return firstMissingNonce;

  // It is possible that the detected_missing_nonces array won't update fast
  // enough and we will continue here w/out knowing there is a missing nonce.
  // This is a backup check that might be helpful if it hits this point?
  if (lastExecutedNonce && lastPendingTxNonce - lastExecutedNonce > 1) {
    toast.error('Possible missing nonce detected');
  }

  if (hasPendingTxs && pendingNoncesIncludesPossibleNextNonceFromApi) return lastPendingTxNonce + 1;

  return possibleNextNonce;
}
