import { useSelector } from 'react-redux';

import { createSelector } from '@reduxjs/toolkit';

import { selectHasLedgerKeys } from '../ledger/ledger.selectors';
import { selectHasSecretKey } from '../software-keys/software-key.selectors';

export enum WalletType {
  Ledger = 'ledger',
  Software = 'software',
}

export const selectWalletType = createSelector(
  selectHasLedgerKeys,
  selectHasSecretKey,
  (hasLedgerKeys, hasSecretKey) => {
    if (hasSecretKey) {
      return WalletType.Software;
    }
    if (hasLedgerKeys) {
      return WalletType.Ledger;
    }
    // TODO: better error handling
    return undefined;
  }
);

export function useWalletTypeSelector() {
  return useSelector(selectWalletType);
}
