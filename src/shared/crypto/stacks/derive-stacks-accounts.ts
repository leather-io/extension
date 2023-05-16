import { generateNewAccount, generateWallet } from '@stacks/wallet-sdk';
import memoize from 'promise-memoize';

export async function deriveStacksAccounts(secretKey: string, highestAccountIndex: number) {
  // Here we only want the resulting `Wallet` objects, but the API
  // requires a password (so it can also return an encrypted key)
  const wallet = await generateWallet({ secretKey, password: '' });
  let walWithAccounts = wallet;
  for (let i = 0; i < highestAccountIndex; i++) {
    walWithAccounts = generateNewAccount(walWithAccounts);
  }
  return walWithAccounts;
}

export const deriveStacksAccountsMemoized = memoize(deriveStacksAccounts);
