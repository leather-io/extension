import { useMemo } from 'react';

import { createMoney } from '@shared/models/money.model';

import { sumNumbers } from '@app/common/math/helpers';

import { filterUtxosWithInscriptions } from '../address/utxos-by-address.hooks';
import { useTaprootAccountUtxosQuery } from '../address/utxos-by-address.query';
import { UtxoWithDerivationPath } from '../bitcoin-client';
import { useGetInscriptionsInfiniteQuery } from '../ordinals/inscriptions.query';

export function useCurrentTaprootAccountUninscribedUtxos() {
  const { data: utxos = [] } = useTaprootAccountUtxosQuery();

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
