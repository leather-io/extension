import { QueryFunctionContext, useQuery } from '@tanstack/react-query';

import {
  BitcoinAccountServiceRequest,
  type BtcAccountBalance,
  getBtcBalancesService,
} from '@leather.io/services';

import { toFetchState } from '@shared/fetch-state';
import { logger } from '@shared/logger';

import { useCurrentAccountIndex } from '@app/store/accounts/account';
import { useCurrentNativeSegwitAccount } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useTaprootAccount } from '@app/store/accounts/blockchain/bitcoin/taproot-account.hooks';
import { useDiscardedInscriptions } from '@app/store/settings/settings.selectors';

export function useCurrentBtcAccountBalance() {
  const index = useCurrentAccountIndex();
  const trAccount = useTaprootAccount(index);
  const nsAccount = useCurrentNativeSegwitAccount();
  const { discardedInscriptions } = useDiscardedInscriptions();
  logger.debug('discared inscriptions', discardedInscriptions);

  return toFetchState<BtcAccountBalance>(
    useBtcAccountBalanceQuery({
      account: {
        accountIndex: index,
        fingerprint: trAccount ? trAccount.keychain.fingerprint.toString() : '',
        taprootDescriptor: trAccount ? `tr(${trAccount?.keychain.publicExtendedKey})` : '',
        nativeSegwitDescriptor: nsAccount ? `wpkh(${nsAccount?.keychain.publicExtendedKey})` : '',
      },
      unprotectedUtxos: discardedInscriptions.map(satPoint => ({
        txid: satPoint.split(':')[0],
        vout: Number(satPoint.split(':')[1]),
      })),
    })
  );
}

export function useBtcAccountBalanceQuery(serviceRequest: BitcoinAccountServiceRequest) {
  return useQuery({
    queryKey: [
      'btc-balance-service-get-btc-account-balance',
      serviceRequest.account.accountIndex,
      serviceRequest.unprotectedUtxos,
    ],
    queryFn: async ({ signal }: QueryFunctionContext) => {
      logger.debug('Calling btc balances service: ', serviceRequest);
      return await getBtcBalancesService().getBtcAccountBalance(serviceRequest, signal);
    },
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retryOnMount: false,
    staleTime: 1 * 5000,
    gcTime: 1 * 5000,
  });
}

export function useBtcAggregateBalanceQuery(serviceRequests: BitcoinAccountServiceRequest[]) {
  return useQuery({
    queryKey: ['btc-balance-service-get-btc-aggregate-balance', serviceRequests],
    queryFn: ({ signal }: QueryFunctionContext) =>
      getBtcBalancesService().getBtcAggregateBalance(serviceRequests, signal),
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retryOnMount: false,
    staleTime: 1 * 1000,
    gcTime: 1 * 1000,
  });
}
