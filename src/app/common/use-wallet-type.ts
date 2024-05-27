import { useMemo } from 'react';

import { type WalletType, useWalletTypeSelector } from '@app/store/common/wallet-type.selectors';

function isLedgerWallet(walletType?: WalletType) {
  return walletType === 'ledger';
}

function isSoftwareWallet(walletType?: WalletType) {
  return walletType === 'software';
}

type WalletTypeMap<T> = Record<WalletType, T>;

function whenWallet(walletType?: WalletType) {
  return <T extends WalletTypeMap<unknown>>(walletTypeMap: T) => {
    if (isLedgerWallet(walletType)) return walletTypeMap.ledger as T[WalletType.Ledger];
    if (isSoftwareWallet(walletType)) return walletTypeMap.software as T[WalletType.Software];
    throw new Error('Wallet is neither of type `ledger` nor `software`');
  };
}

export function useWalletType() {
  const walletType = useWalletTypeSelector();

  return useMemo(
    () => ({
      walletType,
      whenWallet: whenWallet(walletType),
    }),
    [walletType]
  );
}
