import { Wallet } from '@stacks/wallet-sdk';
import memoize from 'promise-memoize';

import { deriveStacksAccounts } from '@shared/crypto/stacks/derive-stacks-accounts';
import { InternalMethods } from '@shared/message-types';
import { RequestDerivedStxAccounts } from '@shared/messages';

import { delay } from '@app/common/utils';
import { RootState } from '@app/store';

export const selectStacksChain = (state: RootState) => state.chains.stx;

const requestDerivedStacksAccountFromBackground = memoize(async () => {
  async (secretKey: string, highestAccountIndex: number): Promise<Wallet> => {
    const message: RequestDerivedStxAccounts = {
      method: InternalMethods.RequestDerivedStxAccounts,
      payload: { secretKey, highestAccountIndex },
    };
    return new Promise(resolve => chrome.runtime.sendMessage(message, resp => resolve(resp)));
  };
});

export async function deriveWalletWithAccounts(secretKey: string, highestAccountIndex: number) {
  const cachedResult = await Promise.race([
    requestDerivedStacksAccountFromBackground(),
    delay(1000),
  ]);
  if (cachedResult) return cachedResult as Wallet;
  return deriveStacksAccounts(secretKey, highestAccountIndex);
}
