import { useMemo } from 'react';

// eslint-disable-next-line no-restricted-imports
import { isUndefined } from '@shared/utils';

import { useHasBitcoinLedgerKeychain } from '@app/store/accounts/blockchain/bitcoin/bitcoin.ledger';
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
  const hasBitcoinLedgerKeychain = useHasBitcoinLedgerKeychain();
  let walletType = wallet?.type;

  if (isUndefined(walletType) && hasBitcoinLedgerKeychain) {
    walletType = 'ledger';
  }

  return useMemo(
    () => ({
      walletType,
      // Coercing type here allows use within app without handling undefined
      // case will error when use within onboarding
      whenWallet: whenWallet(walletType as any),
    }),
    [walletType]
  );
}
