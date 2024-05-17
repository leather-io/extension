import { useMemo } from 'react';

import { createMoney } from '@shared/models/money.model';

import { sumNumbers } from '@app/common/math/helpers';

import { filterUtxosWithInscriptions } from '../address/utxos-by-address.hooks';
import { useTaprootAccountUtxosQuery } from '../address/utxos-by-address.query';
import { UtxoWithDerivationPath } from '../bitcoin-client';
import { useGetInscriptionsInfiniteQuery } from '../ordinals/inscriptions.query';

const RETRIEVE_UTXO_DUST_AMOUNT = 10000;

export function useCurrentTaprootAccountUninscribedUtxos() {
  const { data: utxos = [] } = useTaprootAccountUtxosQuery();

  const query = useGetInscriptionsInfiniteQuery();

  return useMemo(() => {
    const inscriptions = query.data?.pages?.flatMap(page => page.inscriptions) ?? [];

    const filteredUtxosList = utxos
      .filter(utxo => utxo.status.confirmed)
      .filter(utxo => utxo.value > RETRIEVE_UTXO_DUST_AMOUNT);

    return filterUtxosWithInscriptions(inscriptions, filteredUtxosList) as UtxoWithDerivationPath[];
  }, [query.data?.pages, utxos]);
}

export function useCurrentTaprootAccountBalance() {
  const uninscribedUtxos = useCurrentTaprootAccountUninscribedUtxos();

  return useMemo(
    () => createMoney(sumNumbers(uninscribedUtxos.map(utxo => Number(utxo.value))), 'BTC'),
    [uninscribedUtxos]
  );
}
