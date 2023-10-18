import { useSelector } from 'react-redux';

import { selectDefaultWalletBitcoinKeyEntities } from '@app/store/ledger/bitcoin-key.slice';

export function useHasBitcoinLedgerKeychain() {
  const bitcoinEntities = useSelector(selectDefaultWalletBitcoinKeyEntities);
  return Object.keys(bitcoinEntities).length > 0;
}
