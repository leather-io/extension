import { Wallet } from '@stacks/wallet-sdk';
import { useAsync } from 'react-async-hook';
import { useSelector } from 'react-redux';
import memoize from 'promise-memoize';

import { RootState } from '@app/store';
import { useCurrentKey } from '@app/store/keys/key.selectors';
import { RequestDerivedStxAccounts } from '@shared/vault/vault-types';
import { InternalMethods } from '@shared/message-types';

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
  const currAccount = useCurrentKey();
  const stxChainState = useSelector(selectStxChain);
  return useAsync(async () => {
    if (!currAccount) return undefined;
    if (!currAccount.secretKey) return undefined;
    return deriveWalletWithAccounts(
      currAccount.secretKey,
      stxChainState.default.highestAccountIndex
    );
  }, [currAccount, stxChainState]).result;
}
