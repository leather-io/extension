import { useMemo } from 'react';

import { useCurrentKeyDetails } from '@app/store/keys/key.selectors';

type WalletType = 'ledger' | 'software';

function isLedgerWallet(walletType: WalletType) {
  return walletType === 'ledger';
}

function isSoftwareWallet(walletType: WalletType) {
  return walletType === 'software';
}

type WalletTypeMap<T> = Record<WalletType, T>;

function whenWallet(walletType: WalletType) {
  return <T extends WalletTypeMap<unknown>>(walletTypeMap: T) => {
    if (isLedgerWallet(walletType)) return walletTypeMap.ledger as T['ledger'];
    if (isSoftwareWallet(walletType)) return walletTypeMap.software as T['software'];
    throw new Error('Wallet is neither of type `ledger` nor `software`');
  };
}

export function useWalletType() {
  const wallet = useCurrentKeyDetails();
  return useMemo(
    () => ({
      walletType: wallet?.type,
      // Coercing type here allows use within app without handling undefined
      // case will error when use within onboarding
      whenWallet: whenWallet(wallet?.type as any),
    }),
    [wallet]
  );
}
