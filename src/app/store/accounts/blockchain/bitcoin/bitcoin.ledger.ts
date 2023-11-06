import { useSelector } from 'react-redux';

import { inferNetworkFromPath } from '@shared/crypto/bitcoin/bitcoin.utils';

import { selectDefaultWalletBitcoinKeyEntities } from '@app/store/ledger/bitcoin/bitcoin-key.slice';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';

export function useHasBitcoinLedgerKeychain() {
  const network = useCurrentNetwork();

  const bitcoinEntities = useSelector(selectDefaultWalletBitcoinKeyEntities);

  const values = Object.values(bitcoinEntities);

  if (values.length === 0) {
    return false;
  }

  const hasNetworkKeys = values.some(v => {
    const path = v?.path;
    if (!path) {
      return false;
    }
    return inferNetworkFromPath(path) === network.chain.bitcoin.network;
  });

  return hasNetworkKeys;
}

export function useFilteredBitcoinEntities() {
  const bitcoinEntities = useSelector(selectDefaultWalletBitcoinKeyEntities);
  const network = useCurrentNetwork();

  return Object.values(bitcoinEntities).filter(v => {
    const path = v?.path;
    if (!path) {
      return false;
    }
    return inferNetworkFromPath(path) === network.chain.bitcoin.network;
  });
}
