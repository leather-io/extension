import { AddressNonces } from '@stacks/blockchain-api-client/lib/generated';
import { useGetAccountNonce } from '@common/hooks/account/use-get-account-nonce';
import { UseQueryOptions } from 'react-query';
import { useLastApiNonceState } from '@store/accounts/nonce.hooks';

export function correctNextNonce(apiNonce: AddressNonces): number | undefined {
  if (!apiNonce) return;

  const missingNonces = apiNonce.detected_missing_nonces;
  if (
    missingNonces &&
    missingNonces.length > 0 &&
    missingNonces[0] > (apiNonce.last_executed_tx_nonce || 0)
  ) {
    return missingNonces.sort()[0];
  }
  return apiNonce.possible_next_nonce;
}

export function useNextTxNonce() {
  const [nonce, setLastApiNonce] = useLastApiNonceState();
  const onSuccess = (data: AddressNonces) => {
    const nextNonce = data && correctNextNonce(data);
    if (typeof nextNonce === 'number') setLastApiNonce(nextNonce);
  };
  useGetAccountNonce({ onSuccess } as UseQueryOptions);
  return nonce;
}
