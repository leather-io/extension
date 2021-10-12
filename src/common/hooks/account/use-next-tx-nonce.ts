import { UseQueryOptions } from 'react-query';
import { AddressNonces } from '@stacks/blockchain-api-client/lib/generated';

import { useGetAccountNonce } from '@common/hooks/account/use-get-account-nonce';
import { useLastApiNonceState } from '@store/accounts/nonce.hooks';

export function correctNextNonce(
  apiNonce: AddressNonces
): { nonce: number; isMissing?: boolean } | undefined {
  if (!apiNonce) return;

  const missingNonces = apiNonce.detected_missing_nonces;
  if (
    missingNonces &&
    missingNonces.length > 0 &&
    missingNonces[0] > (apiNonce.last_executed_tx_nonce || 0)
  ) {
    return {
      nonce: missingNonces.sort()[0],
      isMissing: true,
    };
  }
  return {
    nonce: apiNonce.possible_next_nonce,
    isMissing: false,
  };
}

export function useNextTxNonce() {
  const [lastApiNonce, setLastApiNonce] = useLastApiNonceState();
  const queryOptions: UseQueryOptions<AddressNonces> = {
    onSuccess: (data: AddressNonces) => {
      const nextNonce = data && correctNextNonce(data);
      if (nextNonce) setLastApiNonce(nextNonce);
    },
  };
  useGetAccountNonce(queryOptions as any);
  return lastApiNonce?.nonce;
}
