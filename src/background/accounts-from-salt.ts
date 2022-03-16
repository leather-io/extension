import { Account, deriveAccount } from '@stacks/wallet-sdk';
import { mnemonicToSeed } from 'bip39';
import { fromSeed } from 'bip32';
import { BIP32Interface } from 'bitcoinjs-lib';

function accountsFromHighestAccountIndex(
  highestAccountIndex: number,
  rootNode: BIP32Interface,
  salt: string
) {
  const result: Account[] = [];
  for (let index = 0; index <= highestAccountIndex; index++) {
    result.push(
      deriveAccount({
        rootNode,
        index,
        salt,
      })
    );
  }
  return result;
}

async function rootNodeFromSecretKey(secretKey: string) {
  const rootPrivateKey = await mnemonicToSeed(secretKey);
  return fromSeed(rootPrivateKey);
}

// This will create the accounts with INCORRECT appPrivateKey
// This is to keep backward compatibility with dapp who used this incorrect key See Issue #2238
export async function getSavedWalletAccounts({
  secretKey,
  highestAccountIndex,
  salt,
}: {
  secretKey: string;
  highestAccountIndex: number;
  salt: string;
}): Promise<Account[]> {
  // Restore from existing config
  const rootNode = await rootNodeFromSecretKey(secretKey);
  return accountsFromHighestAccountIndex(highestAccountIndex, rootNode, salt);
}
