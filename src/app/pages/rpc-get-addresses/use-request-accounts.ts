import { BtcAddress } from '@btckit/types';
import { bytesToHex } from '@stacks/common';

import { ecdsaPublicKeyToSchnorr } from '@shared/crypto/bitcoin/bitcoin.utils';
import { logger } from '@shared/logger';
import { makeRpcSuccessResponse } from '@shared/rpc/rpc-methods';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useRpcRequestParams } from '@app/common/rpc-helpers';
import { useCurrentAccountNativeSegwitIndexZeroSigner } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useCurrentAccountTaprootIndexZeroSigner } from '@app/store/accounts/blockchain/bitcoin/taproot-account.hooks';
import { useCurrentStacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { useAppPermissions } from '@app/store/app-permissions/app-permissions.slice';

export function useGetAddresses() {
  const analytics = useAnalytics();

  const permissions = useAppPermissions();
  const { tabId, origin, requestId } = useRpcRequestParams();

  const nativeSegwitSigner = useCurrentAccountNativeSegwitIndexZeroSigner();
  const taprootSigner = useCurrentAccountTaprootIndexZeroSigner();
  const stacksAccount = useCurrentStacksAccount();

  const taprootAddressResponse: BtcAddress = {
    symbol: 'BTC',
    type: 'p2tr',
    address: taprootSigner.address,
    publicKey: bytesToHex(taprootSigner.publicKey),
    tweakedPublicKey: bytesToHex(ecdsaPublicKeyToSchnorr(taprootSigner.publicKey)),
    derivationPath: taprootSigner.derivationPath,
  };

  const nativeSegwitAddressResponse: BtcAddress = {
    symbol: 'BTC',
    type: 'p2wpkh',
    address: nativeSegwitSigner.address,
    publicKey: bytesToHex(nativeSegwitSigner.publicKey),
    derivationPath: nativeSegwitSigner.derivationPath,
  };

  const stacksAddressResponse = {
    symbol: 'STX',
    address: stacksAccount?.address ?? '',
  };

  return {
    origin,
    onUserApproveGetAddresses() {
      if (!tabId || !origin) {
        logger.error('Cannot give app accounts: missing tabId, origin');
        return;
      }
      void analytics.track('user_approved_get_addresses', { origin });
      permissions.hasRequestedAccounts(origin);
      chrome.tabs.sendMessage(
        tabId,
        makeRpcSuccessResponse('getAddresses', {
          id: requestId,
          result: {
            addresses: [
              nativeSegwitAddressResponse,
              taprootAddressResponse,
              // casting until btckit has better extend support
              stacksAddressResponse as any,
            ],
          },
        })
      );
      window.close();
    },
  };
}
