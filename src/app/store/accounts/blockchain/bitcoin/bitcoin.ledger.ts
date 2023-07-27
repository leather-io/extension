import { useSelector } from 'react-redux';

import {
  bitcoinNetworkModeToCoreNetworkMode,
  inferNetworkFromPath,
} from '@shared/crypto/bitcoin/bitcoin.utils';

import { selectDefaultWalletBitcoinKeys } from '@app/store/ledger/bitcoin/bitcoin-key.slice';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';

export function useHasBitcoinLedgerKeychain() {
  const network = useCurrentNetwork();
  const accounts = useSelector(selectDefaultWalletBitcoinKeys);

  const hasNetworkKeys = accounts.some(v => {
    return (
      inferNetworkFromPath(v.path) ===
      bitcoinNetworkModeToCoreNetworkMode(network.chain.bitcoin.bitcoinNetwork)
    );
  });

  return hasNetworkKeys;
}

export function useFilteredBitcoinAccounts() {
  const accounts = useSelector(selectDefaultWalletBitcoinKeys);
  const network = useCurrentNetwork();

  return accounts.filter(v => {
    return (
      inferNetworkFromPath(v.path) ===
      bitcoinNetworkModeToCoreNetworkMode(network.chain.bitcoin.bitcoinNetwork)
    );
  });
}
