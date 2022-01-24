import { logger } from '@shared/logger';
import { InternalMethods } from '@shared/message-types';
import { BackgroundActions } from '@shared/vault/vault-types';
import { generateNewAccount, generateWallet } from '@stacks/wallet-sdk';
import memoize from 'promise-memoize';

function validateMessagesAreFromExtension(sender: chrome.runtime.MessageSender) {
  // Only respond to internal messages from our UI, not content scripts in other applications
  return sender.url?.startsWith(chrome.runtime.getURL(''));
}

const deriveWalletWithAccounts = memoize(async (secretKey: string, highestAccountIndex: number) => {
  // Here we only want the resulting `Wallet` objects, but the API
  // requires a password (so it can also return an encrypted key)
  const walletSdk = await generateWallet({ secretKey, password: '' });
  // To generate a new account, the wallet-sdk requires the entire `Wallet` to
  // be supplied so that it can count the `wallet.accounts[]` length, and return
  // a new `Wallet` object with all the accounts. As we want to generate them
  // all, we must set the updated value and read it again in the loop
  let walWithAccounts = walletSdk;
  for (let i = 0; i < highestAccountIndex; i++) {
    walWithAccounts = generateNewAccount(walWithAccounts);
  }
  return walWithAccounts;
});

export async function backgroundMessageHandler(
  message: BackgroundActions,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void
) {
  if (!validateMessagesAreFromExtension(sender)) {
    logger.error('Error: Received background script msg from ' + sender.url);
    return;
  }
  switch (message.method) {
    case InternalMethods.RequestDerivedStxAccounts: {
      const { secretKey, highestAccountIndex } = message.payload;
      const walletsWithAccounts = await deriveWalletWithAccounts(secretKey, highestAccountIndex);
      sendResponse(walletsWithAccounts);
    }
  }
}
