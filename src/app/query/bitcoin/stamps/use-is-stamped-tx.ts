import { useCallback } from 'react';

import { useCurrentBtcNativeSegwitAccountAddressIndexZero } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';

import { useStampsByAddressQuery } from './stamps-by-address.query';

export function useIsStampedTx() {
  const currentAccountBtcAddress = useCurrentBtcNativeSegwitAccountAddressIndexZero();
  const { data: stamps = [] } = useStampsByAddressQuery(currentAccountBtcAddress);

  return useCallback((txid: string) => stamps.some(stamp => stamp.tx_hash === txid), [stamps]);
}
