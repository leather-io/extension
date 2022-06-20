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

function whenWalletFactory(walletType: WalletType) {
  return <T>(walletTypeMap: WalletTypeMap<T>): T => {
    if (isLedgerWallet(walletType)) return walletTypeMap.ledger;
    if (isSoftwareWallet(walletType)) return walletTypeMap.software;
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
      whenWallet: whenWalletFactory(wallet?.type as any),
    }),
    [wallet]
  );
}
