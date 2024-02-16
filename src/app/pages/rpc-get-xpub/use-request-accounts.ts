import {logger} from '@shared/logger';
import {makeRpcSuccessResponse} from '@shared/rpc/rpc-methods';
import {closeWindow} from '@shared/utils';
import {useAnalytics} from '@app/common/hooks/analytics/use-analytics';
import {useRpcRequestParams} from '@app/common/rpc-helpers';
import {useCurrentAccountNativeSegwitSigner} from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import {useCurrentAccountTaprootSigner} from '@app/store/accounts/blockchain/bitcoin/taproot-account.hooks';
import {useAppPermissions} from '@app/store/app-permissions/app-permissions.slice';


export function useGetXpub() {
  const analytics = useAnalytics();

  const permissions = useAppPermissions();
  const {tabId, origin, requestId} = useRpcRequestParams();

  const createNativeSegwitSigner = useCurrentAccountNativeSegwitSigner();
  const createTaprootSigner = useCurrentAccountTaprootSigner();


  return {
    origin,
    onUserApproveGetXpub() {
      if (!tabId || !origin) {
        logger.error('Cannot give app accounts: missing tabId, origin');
        return;
      }

      const keysToIncludeInResponse = [];

      if (createNativeSegwitSigner) {
        const nativeSegwitSigner = createNativeSegwitSigner(0);

        const nativeSegwitXpubResponse: any = {
          symbol: 'BTC',
          type: 'p2wpkh',
          xpub: nativeSegwitSigner.keychain.publicExtendedKey,
        };

        keysToIncludeInResponse.push(nativeSegwitXpubResponse);
      }

      if (createTaprootSigner) {
        const taprootSigner = createTaprootSigner(0);
        const taprootXpubResponse: any = {
          symbol: 'BTC',
          type: 'p2tr',
          xpub: taprootSigner.keychain.publicExtendedKey,
        };
        keysToIncludeInResponse.push(taprootXpubResponse);
      }

      void analytics.track('user_approved_get_xpub', {origin});
      permissions.hasRequestedAccounts(origin);
      chrome.tabs.sendMessage(
        tabId,
        makeRpcSuccessResponse('getXpub', {
          id: requestId,
          result: {xpubs: keysToIncludeInResponse as any},
        })
      );
      closeWindow();
    },
  };
}
