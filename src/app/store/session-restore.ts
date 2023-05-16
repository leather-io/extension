import { decrypt } from '@stacks/wallet-sdk';

import { InternalMethods } from '@shared/message-types';
import { sendMessage } from '@shared/messages';
import { whenBrowserRuntime } from '@shared/utils/get-browser-runtime';

import { store } from '@app/store';
import { inMemoryKeyActions } from '@app/store/in-memory-key/in-memory-key.actions';
import { selectCurrentKey } from '@app/store/keys/key.selectors';
import { defaultKeyId } from '@app/store/keys/key.slice';

export async function initalizeWalletSession(encryptionKey: string, secretKey: string) {
  return await whenBrowserRuntime({
    async chromium() {
      return chrome.storage.session.set({ encryptionKey });
    },
    async firefox() {
      return sendMessage({
        method: InternalMethods.ShareInMemoryKeyToBackground,
        payload: { secretKey, keyId: defaultKeyId },
      });
    },
  })();
}

export async function clearWalletSession() {
  return await whenBrowserRuntime({
    async chromium() {
      return chrome.storage.session.remove('encryptionKey');
    },
    async firefox() {
      return chrome.runtime.sendMessage({ method: InternalMethods.RemoveInMemoryKeys });
    },
  })();
}

export async function restoreWalletSession() {
  return whenBrowserRuntime({
    async chromium() {
      const key = await chrome.storage.session.get(['encryptionKey']);
      if (!key.encryptionKey) return false;

      try {
        const currentKey = selectCurrentKey(store.getState());

        if (currentKey?.type === 'software') {
          const secretKey = await decrypt(currentKey.encryptedSecretKey, key.encryptionKey);
          store.dispatch(inMemoryKeyActions.setKeysInMemory({ default: secretKey }));
          return true;
        }
      } catch (e) {
        return false;
      }

      return false;
    },
    async firefox() {
      return checkForInMemoryKeys();
    },
  })();
}

async function checkForInMemoryKeys() {
  return new Promise(resolve =>
    chrome.runtime.sendMessage({ method: InternalMethods.RequestInMemoryKeys }, resp => {
      if (!resp) resolve(false);
      if (Object.keys(resp).length === 0) return resolve(false);
      store.dispatch(inMemoryKeyActions.setKeysInMemory(resp));
      resolve(true);
    })
  );
}
