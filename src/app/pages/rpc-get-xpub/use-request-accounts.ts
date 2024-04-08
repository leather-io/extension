import { deriveNativeSegwitAccountFromRootKeychain } from '@shared/crypto/bitcoin/p2wpkh-address-gen';
import { logger } from '@shared/logger';
import { makeRpcSuccessResponse } from '@shared/rpc/rpc-methods';
import { closeWindow } from '@shared/utils';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { mnemonicToRootNode } from '@app/common/keychain/keychain';
import { useRpcRequestParams } from '@app/common/rpc-helpers';
import { useCurrentAccountIndex } from '@app/store/accounts/account';
import { useAppPermissions } from '@app/store/app-permissions/app-permissions.slice';
import { useDefaultWalletSecretKey } from '@app/store/in-memory-key/in-memory-key.selectors';

export function useGetXpub() {
  const analytics = useAnalytics();

  const permissions = useAppPermissions();
  const { tabId, origin, requestId } = useRpcRequestParams();

  const currentAccountIndex = useCurrentAccountIndex();
  const secretKey = useDefaultWalletSecretKey();
  const rootKey = secretKey ? mnemonicToRootNode(secretKey) : null;

  return {
    origin,
    onUserApproveGetXpub() {
      if (!tabId || !origin) {
        logger.error('Cannot give app accounts: missing tabId, origin');
        return;
      }

      const keysToIncludeInResponse = [];

      if (rootKey) {
        const createBitcoinAccount = deriveNativeSegwitAccountFromRootKeychain(rootKey, 'mainnet');
        const currentBitcoinAccount = createBitcoinAccount(currentAccountIndex);

        const nativeSegwitXpubResponse: any = {
          symbol: 'BTC',
          type: 'p2wpkh',
          xpub: currentBitcoinAccount.keychain.publicExtendedKey,
        };

        keysToIncludeInResponse.push(nativeSegwitXpubResponse);
      }

      void analytics.track('user_approved_get_xpub', { origin });
      permissions.hasRequestedAccounts(origin);
      chrome.tabs.sendMessage(
        tabId,
        makeRpcSuccessResponse('getXpub', {
          id: requestId,
          result: { xpubs: keysToIncludeInResponse as any },
        })
      );
      closeWindow();
    },
  };
}
