import { Account, getAppPrivateKey } from '@stacks/wallet-sdk';

const walletSaltBackup = 'salt-used-in-app-key-in-gaia';

export function getWalletSaltThatGeneratedIncorrectKey() {
  return localStorage.getItem(walletSaltBackup) || undefined;
}

export function appPrivateKeyFromAccount({
  accountFromWalletSalt,
  appDomain,
}: {
  accountFromWalletSalt: Account | undefined;
  appDomain: string;
}) {
  if (!accountFromWalletSalt) return;
  return getAppPrivateKey({
    account: accountFromWalletSalt,
    appDomain,
  });
}
