import { useMemo } from 'react';

import { BtcAddress } from '@btckit/types';

import { logger } from '@shared/logger';
import { makeRpcSuccessResponse } from '@shared/rpc/rpc-methods';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useDefaultRequestParams } from '@app/common/hooks/use-default-request-search-params';
import { initialSearchParams } from '@app/common/initial-search-params';
import { useCurrentBtcNativeSegwitAccountAddressIndexZero } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useCurrentBtcTaprootAccountAddressIndexZeroPayment } from '@app/store/accounts/blockchain/bitcoin/taproot-account.hooks';
import { useAppPermissions } from '@app/store/app-permissions/app-permissions.slice';

function useRpcRequestParams() {
  const defaultParams = useDefaultRequestParams();
  return useMemo(
    () => ({
      ...defaultParams,
      requestId: initialSearchParams.get('requestId') ?? '',
    }),
    [defaultParams]
  );
}

export function useRequestAccounts() {
  const analytics = useAnalytics();

  const permissions = useAppPermissions();
  const { tabId, origin, requestId } = useRpcRequestParams();

  const nativeSegwitAddress = useCurrentBtcNativeSegwitAccountAddressIndexZero();
  const taprootPayment = useCurrentBtcTaprootAccountAddressIndexZeroPayment();

  const taprootAddressResponse: BtcAddress = {
    symbol: 'BTC',
    type: 'p2tr',
    address: taprootPayment.address,
  };

  const nativeSegwitAddressResponse: BtcAddress = {
    symbol: 'BTC',
    type: 'p2wpkh',
    address: nativeSegwitAddress,
  };

  return {
    origin,
    onUserApproveRequestAccounts() {
      if (!tabId || !origin) {
        logger.error('Cannot give app accounts: missing tabId, origin');
        return;
      }
      void analytics.track('user_approved_request_accounts', { origin });
      permissions.hasRequestedAccounts(origin);
      chrome.tabs.sendMessage(
        tabId,
        makeRpcSuccessResponse('getAddresses', {
          id: requestId,
          result: {
            addresses: [nativeSegwitAddressResponse, taprootAddressResponse],
          },
        })
      );
      window.close();
    },
  };
}
