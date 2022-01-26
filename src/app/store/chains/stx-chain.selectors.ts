import { Wallet } from '@stacks/wallet-sdk';
import { useAsync } from 'react-async-hook';
import { useSelector } from 'react-redux';
import memoize from 'promise-memoize';

import { RootState } from '@app/store';
import { useCurrentKeyDetails } from '@app/store/keys/key.selectors';
import { RequestDerivedStxAccounts } from '@shared/messages';
import { InternalMethods } from '@shared/message-types';
import { useDefaultWalletSecretKey } from '../in-memory-key/in-memory-key.selectors';

const selectStxChain = (state: RootState) => state.chains.stx;

export const deriveWalletWithAccounts = memoize(
  async (secretKey: string, highestAccountIndex: number): Promise<Wallet> => {
    const message: RequestDerivedStxAccounts = {
      method: InternalMethods.RequestDerivedStxAccounts,
      payload: { secretKey, highestAccountIndex },
    };
    return new Promise(resolve => chrome.runtime.sendMessage(message, resp => resolve(resp)));
  }
);

export function useGeneratedCurrentWallet() {
  const currentKeyDetails = useCurrentKeyDetails();
  const stxChainState = useSelector(selectStxChain);
  const defaultWalletSecretKey = useDefaultWalletSecretKey();
  return useAsync(async () => {
    if (!currentKeyDetails) return undefined;
    if (!defaultWalletSecretKey) return undefined;
    return deriveWalletWithAccounts(
      defaultWalletSecretKey,
      stxChainState.default.highestAccountIndex
    );
  }, [currentKeyDetails, stxChainState]).result;
}
