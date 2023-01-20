import { Wallet } from '@stacks/wallet-sdk';
import memoize from 'promise-memoize';

import { InternalMethods } from '@shared/message-types';
import { RequestDerivedStxAccounts } from '@shared/messages';

import { RootState } from '@app/store';

export const selectStacksChain = (state: RootState) => state.chains.stx;

export const deriveWalletWithAccounts = memoize(
  async (secretKey: string, highestAccountIndex: number): Promise<Wallet> => {
    const message: RequestDerivedStxAccounts = {
      method: InternalMethods.RequestDerivedStxAccounts,
      payload: { secretKey, highestAccountIndex },
    };
    return new Promise(resolve => chrome.runtime.sendMessage(message, resp => resolve(resp)));
  }
);
