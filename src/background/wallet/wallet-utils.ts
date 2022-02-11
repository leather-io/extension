import { Account, deriveAccount, generateWallet, WalletConfig } from '@stacks/wallet-sdk';
import { Wallet as SDKWallet } from '@stacks/wallet-sdk';
import { mnemonicToSeed } from 'bip39';
import { fromSeed } from 'bip32';
import { BIP32Interface } from 'bitcoinjs-lib';

function getSavedWalletConfig() {
  const walletConfig = localStorage.getItem('walletConfig');
  if (typeof walletConfig !== 'string') return;
  try {
    return JSON.parse(walletConfig) as WalletConfig;
  } catch (e) {
    return;
  }
}

function accountsFromWalletConfig(
  walletConfig: WalletConfig,
  rootNode: BIP32Interface,
  salt: string
) {
  return walletConfig.accounts.map((account, index) => {
    const existingAccount = deriveAccount({
      rootNode,
      index,
      salt,
    });
    return {
      ...existingAccount,
      username: account.username,
    };
  });
}

async function rootNodeFromSecretKey(secretKey: string) {
  const rootPrivateKey = await mnemonicToSeed(secretKey);
  return fromSeed(rootPrivateKey);
}

async function getSavedWalletAccounts({
  secretKey,
  walletConfig,
  salt,
}: {
  secretKey: string;
  walletConfig: WalletConfig;
  salt: string;
}): Promise<Account[]> {
  // Restore from existing config
  const rootNode = await rootNodeFromSecretKey(secretKey);
  if (!walletConfig) return [] as Account[];
  return accountsFromWalletConfig(walletConfig, rootNode, salt);
}

interface GetWalletParams {
  secretKey: string;
  salt: string;
  password: string;
}

export async function getWallet(params: GetWalletParams): Promise<SDKWallet | undefined> {
  const { secretKey, salt, password } = params;
  const wallet = await generateWallet({
    secretKey,
    password,
  });

  const walletConfig = getSavedWalletConfig();
  if (!walletConfig) return;

  const accounts = await getSavedWalletAccounts({
    secretKey,
    walletConfig,
    salt,
  });

  if (accounts.length === 0) return wallet;

  return { ...wallet, accounts };
}
