import { BtcAddress } from '@btckit/types';
import { bytesToHex } from '@stacks/common';

import { ecdsaPublicKeyToSchnorr } from '@shared/crypto/bitcoin/bitcoin.utils';
import { logger } from '@shared/logger';
import { makeRpcSuccessResponse } from '@shared/rpc/rpc-methods';
import { closeWindow } from '@shared/utils';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useRpcRequestParams } from '@app/common/rpc-helpers';
import { useCurrentAccountNativeSegwitSigner } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useCurrentAccountTaprootSigner } from '@app/store/accounts/blockchain/bitcoin/taproot-account.hooks';
import { useCurrentStacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { useAppPermissions } from '@app/store/app-permissions/app-permissions.slice';

export function useGetAddresses() {
  const analytics = useAnalytics();

  const permissions = useAppPermissions();
  const { tabId, origin, requestId } = useRpcRequestParams();

  const createNativeSegwitSigner = useCurrentAccountNativeSegwitSigner();
  const createTaprootSigner = useCurrentAccountTaprootSigner();
  const stacksAccount = useCurrentStacksAccount();

  return {
    origin,
    onUserApproveGetAddresses() {
      if (!tabId || !origin) {
        logger.error('Cannot give app accounts: missing tabId, origin');
        return;
      }

      const keysToIncludeInResponse = [];

      if (createNativeSegwitSigner) {
        const nativeSegwitSigner = createNativeSegwitSigner(0);

        const nativeSegwitAddressResponse: BtcAddress = {
          symbol: 'BTC',
          type: 'p2wpkh',
          address: nativeSegwitSigner.address,
          publicKey: bytesToHex(nativeSegwitSigner.publicKey),
          derivationPath: nativeSegwitSigner.derivationPath,
        };

        keysToIncludeInResponse.push(nativeSegwitAddressResponse);
      }

      if (createTaprootSigner) {
        const taprootSigner = createTaprootSigner(0);
        const taprootAddressResponse: BtcAddress = {
          symbol: 'BTC',
          type: 'p2tr',
          address: taprootSigner.address,
          publicKey: bytesToHex(taprootSigner.publicKey),
          tweakedPublicKey: bytesToHex(ecdsaPublicKeyToSchnorr(taprootSigner.publicKey)),
          derivationPath: taprootSigner.derivationPath,
        };
        keysToIncludeInResponse.push(taprootAddressResponse);
      }

      if (stacksAccount) {
        const stacksAddressResponse = {
          symbol: 'STX',
          address: stacksAccount?.address ?? '',
        };

        keysToIncludeInResponse.push(stacksAddressResponse);
      }

      void analytics.track('user_approved_get_addresses', { origin });
      permissions.hasRequestedAccounts(origin);
      chrome.tabs.sendMessage(
        tabId,
        makeRpcSuccessResponse('getAddresses', {
          id: requestId,
          result: { addresses: keysToIncludeInResponse as any },
        })
      );
      closeWindow();
    },
  };
}
