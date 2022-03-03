const walletSaltBackup = 'wallet-salt-backup';

export function backupOldWalletSalt() {
  const salt = localStorage.getItem('stacks-wallet-salt');
  // Save the previous wallet salt to later store on gaia encrypted
  if (salt !== null) localStorage.setItem(walletSaltBackup, salt);
}
