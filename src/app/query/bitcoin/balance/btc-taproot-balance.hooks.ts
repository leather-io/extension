import { useMemo } from 'react';

import { filterUtxosWithInscriptions, useTaprootAccountUtxosQuery } from '@leather-wallet/query';

import { createMoney } from '@shared/models/money.model';

import { sumNumbers } from '@app/common/math/helpers';
import { useCurrentAccountIndex } from '@app/store/accounts/account';
import { useCurrentTaprootAccount } from '@app/store/accounts/blockchain/bitcoin/taproot-account.hooks';

import { UtxoWithDerivationPath } from '../bitcoin-client';
import { useGetInscriptionsInfiniteQuery } from '../ordinals/inscriptions.query';

export function useCurrentTaprootAccountUninscribedUtxos() {
  const account = useCurrentTaprootAccount();

  const currentAccountIndex = useCurrentAccountIndex();

  const { data: utxos = [] } = useTaprootAccountUtxosQuery({
    taprootKeychain: account?.keychain,
    currentAccountIndex,
  });

  const query = useGetInscriptionsInfiniteQuery();

  return useMemo(() => {
    const inscriptions = query.data?.pages?.flatMap(page => page.inscriptions) ?? [];
    return filterUtxosWithInscriptions(
      inscriptions,
      utxos.filter(utxo => utxo.status.confirmed)
    ) as UtxoWithDerivationPath[];
  }, [query.data?.pages, utxos]);
}

export function useCurrentTaprootAccountBalance() {
  const uninscribedUtxos = useCurrentTaprootAccountUninscribedUtxos();

  return useMemo(
    () => createMoney(sumNumbers(uninscribedUtxos.map(utxo => Number(utxo.value))), 'BTC'),
    [uninscribedUtxos]
  );
}
