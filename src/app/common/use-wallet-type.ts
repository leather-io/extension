import { useMemo } from 'react';

import { useHasLedgerKeys } from '@app/store/ledger/ledger.selectors';
import { useCurrentKeyDetails } from '@app/store/software-keys/software-key.selectors';

enum WalletType {
  Ledger = 'ledger',
  Software = 'software',
}

function isLedgerWallet(walletType: WalletType) {
  return walletType === 'ledger';
}

function isSoftwareWallet(walletType: WalletType) {
  return walletType === 'software';
}

type WalletTypeMap<T> = Record<WalletType, T>;

function whenWallet(walletType: WalletType) {
  return <T extends WalletTypeMap<unknown>>(walletTypeMap: T) => {
    if (isLedgerWallet(walletType)) return walletTypeMap.ledger as T[WalletType.Ledger];
    if (isSoftwareWallet(walletType)) return walletTypeMap.software as T[WalletType.Software];
    throw new Error('Wallet is neither of type `ledger` nor `software`');
  };
}

export function useWalletType() {
  const wallet = useCurrentKeyDetails();
  const isLedger = useHasLedgerKeys();

  // Any type here allows use within app without handling undefined
  // case will error when use within onboarding
  let walletType: any;

  if (wallet?.encryptedSecretKey) {
    walletType = WalletType.Software;
  }
  if (isLedger) {
    walletType = WalletType.Ledger;
  }

  return useMemo(
    () => ({
      walletType,
      whenWallet: whenWallet(walletType),
    }),
    [walletType]
  );
}
