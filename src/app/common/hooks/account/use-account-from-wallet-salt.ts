import { getWalletSaltThatGeneratedIncorrectKey } from '@app/common/utils/wallet-salt-that-generated-incorrect-appkey';
import { RootState } from '@app/store';
import { useDefaultWalletSecretKey } from '@app/store/in-memory-key/in-memory-key.selectors';
import { useCurrentKeyDetails } from '@app/store/keys/key.selectors';
import { InternalMethods } from '@shared/message-types';
import { RequestAccountsFromWalletSalt } from '@shared/messages';
import { Account } from '@stacks/wallet-sdk';
import memoize from 'promise-memoize';
import { useAsync } from 'react-async-hook';
import { useSelector } from 'react-redux';

const selectStxChain = (state: RootState) => state.chains.stx;

const deriveAccountsFromWalletSalt = memoize(
  async (secretKey: string, salt: string, highestAccountIndex: number): Promise<Account[]> => {
    const message: RequestAccountsFromWalletSalt = {
      method: InternalMethods.RequestAccountsFromWalletSalt,
      payload: { secretKey, salt, highestAccountIndex },
    };
    return new Promise(resolve => chrome.runtime.sendMessage(message, resp => resolve(resp)));
  }
);

export function useDeriveAccountsFromWalletSalt() {
  const defaultWalletSecretKey = useDefaultWalletSecretKey();
  const currentKeyDetails = useCurrentKeyDetails();
  const stxChainState = useSelector(selectStxChain);
  const salt = getWalletSaltThatGeneratedIncorrectKey();

  return (
    useAsync(async () => {
      if (!salt || !defaultWalletSecretKey) return [] as Account[];
      return deriveAccountsFromWalletSalt(
        defaultWalletSecretKey,
        salt,
        stxChainState.default.highestAccountIndex
      );
    }, [currentKeyDetails, stxChainState]).result || ([] as Account[])
  );
}
