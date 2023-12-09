import { useState } from 'react';

import { isDefined, isUndefined } from '@shared/utils';

import { useOnMount } from '@app/common/hooks/use-on-mount';
import { useNextNonce } from '@app/query/stacks/nonce/account-nonces.hooks';

export function usePersistedNonce() {
  const [persistedNonce, setPersistedNonce] = useState(0);
  const { data: nextNonce } = useNextNonce();

  useOnMount(async () => {
    const state = await chrome.storage.session.get('nonce');
    const persistedNonceState = state['nonce'];

    if (!persistedNonceState && isDefined(nextNonce)) {
      setPersistedNonce(nextNonce.nonce ?? 0);
      await chrome.storage.session.set({ nonce: nextNonce.nonce });
      return;
    }

    setPersistedNonce(persistedNonceState);

    return async () => {
      if (isUndefined(chrome.storage.session)) return;
      await chrome.storage.session.remove('nonce');
    };
  });

  return {
    persistedNonce,
    async decrementPersistedNonce() {
      setPersistedNonce(persistedNonce - 1);
      await chrome.storage.session.set({ nonce: persistedNonce - 1 });
    },
    async incrementPersistedNonce() {
      setPersistedNonce(persistedNonce + 1);
      await chrome.storage.session.set({ nonce: persistedNonce + 1 });
    },
  };
}
