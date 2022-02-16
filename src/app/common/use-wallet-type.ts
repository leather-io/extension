import { useCurrentKeyDetails } from '@app/store/keys/key.selectors';
import { useCallback } from 'react';

export type WalletType = 'ledger' | 'software';

export function isLedgerWallet(walletType: WalletType) {
  return walletType === 'ledger';
}

export function isSoftwareWallet(walletType: WalletType) {
  return walletType === 'software';
}

export function whenWalletFactory(walletType: WalletType) {
  return <T>(walletTypeMap: { ledger: T; software: T }): T => {
    if (isLedgerWallet(walletType)) return walletTypeMap.ledger;
    if (isSoftwareWallet(walletType)) return walletTypeMap.software;
    throw new Error('Wallet is neither of type `ledger` nor `software`');
  };
}

type WhenWalletCallback = ReturnType<typeof whenWalletFactory>;

export function useWalletType() {
  const wallet = useCurrentKeyDetails();
  if (!wallet) {
    throw new Error('Cannot use `useWalletType` when no wallet created');
  }
  const whenWallet = useCallback<WhenWalletCallback>(
    args => whenWalletFactory(wallet.type)(args),
    [wallet.type]
  );
  return { walletType: wallet.type, whenWallet };
}
