import { useMemo } from 'react';

import { useCurrentAccountNativeSegwitSigner } from './native-segwit-account.hooks';

export interface BtcAccount {
  index: number;
  address: string;
}

export function useBtcAccounts(): BtcAccount[] {
  const signer = useCurrentAccountNativeSegwitSigner();

  return useMemo(() => {
    if (!signer) return [];
    const addresses = [];
    for (let i = 0; i < 5; i++) {
      const address = signer(i).payment.address;
      if (address) {
        addresses.push({ index: i, address });
      }
    }
    return addresses;
  }, [signer]);
}
