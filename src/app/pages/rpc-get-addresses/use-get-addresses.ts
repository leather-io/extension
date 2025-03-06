import { bytesToHex } from '@stacks/common';
import { z } from 'zod';

import { ecdsaPublicKeyToSchnorr } from '@leather.io/bitcoin';
import {
  type BtcAddress,
  type StxAddress,
  createRequestEncoder,
  createRpcSuccessResponse,
  getAddresses,
  stxGetAddresses,
} from '@leather.io/rpc';

import { logger } from '@shared/logger';
import { analytics } from '@shared/utils/analytics';

import { focusTabAndWindow } from '@app/common/focus-tab';
import { initialSearchParams } from '@app/common/initial-search-params';
import { useRpcRequestParams } from '@app/common/rpc/use-rpc-request';
import { useCurrentAccountNativeSegwitSigner } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useCurrentAccountTaprootSigner } from '@app/store/accounts/blockchain/bitcoin/taproot-account.hooks';
import { useCurrentStacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { useAppPermissions } from '@app/store/app-permissions/app-permissions.slice';

// We reuse this flow for both of these requsts, so here we make a union of two
// possible requests
const getAddressesRequests = z.union([getAddresses.request, stxGetAddresses.request]);
const { decode } = createRequestEncoder(getAddressesRequests);

function useGetAddressesParams() {
  const { tabId, origin } = useRpcRequestParams();
  const request = initialSearchParams.get('rpcRequest');
  if (!request) throw new Error('Missing rpcRequest');
  return { tabId, origin, request: decode(request) };
}

export function useGetAddresses() {
  const permissions = useAppPermissions();
  const { tabId, origin, request } = useGetAddressesParams();
  const createNativeSegwitSigner = useCurrentAccountNativeSegwitSigner();
  const createTaprootSigner = useCurrentAccountTaprootSigner();
  const stacksAccount = useCurrentStacksAccount();

  function focusInitatingTab() {
    void analytics.track('user_clicked_requested_by_link', { endpoint: request.method });
    focusTabAndWindow(tabId);
  }

  return {
    origin,
    focusInitatingTab,
    onUserApproveGetAddresses() {
      if (!tabId || !origin) {
        logger.error('Cannot give app accounts: missing tabId, origin');
        return;
      }

      void analytics.track('user_approved_get_addresses', { origin });

      permissions.hasRequestedAccounts(origin);

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
          address: stacksAccount.address,
          publicKey: stacksAccount.stxPublicKey,
        } satisfies StxAddress;

        keysToIncludeInResponse.push(stacksAddressResponse);
      }

      chrome.tabs.sendMessage(
        tabId,
        createRpcSuccessResponse(request.method, {
          id: request.id,
          result: { addresses: keysToIncludeInResponse },
        })
      );
    },
  };
}
