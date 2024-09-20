import { useCallback } from 'react';

import type { Blockchain } from '@leather.io/models';

import { useHasCurrentBitcoinAccount } from './bitcoin/bitcoin.hooks';
import { useHasStacksLedgerKeychain } from './stacks/stacks.hooks';

// TODO: Asset refactor: remove if determined unnecessary
// ts-unused-exports:disable-next-line
export function useCheckLedgerBlockchainAvailable() {
  const hasBitcoinLedgerKeys = useHasCurrentBitcoinAccount();
  const hasStacksLedgerKeys = useHasStacksLedgerKeychain();

  return useCallback(
    (chain: Blockchain) => {
      if (chain === 'bitcoin') {
        return hasBitcoinLedgerKeys;
      }
      if (chain === 'stacks') {
        return hasStacksLedgerKeys;
      }
      return false;
    },
    [hasBitcoinLedgerKeys, hasStacksLedgerKeys]
  );
}
