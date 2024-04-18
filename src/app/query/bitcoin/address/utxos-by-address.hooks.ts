import { useCallback } from 'react';

import { InscriptionResponseItem } from '@shared/models/inscription.model';

import { useCurrentAccountNativeSegwitIndexZeroSigner } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';

import {
  type RunesOutputsByAddress,
  UtxoResponseItem,
  UtxoWithDerivationPath,
} from '../bitcoin-client';
import { useInscriptionsByAddressQuery } from '../ordinals/inscriptions.query';
import { useRunesEnabled, useRunesOutputsByAddress } from '../runes/runes.hooks';
import { useBitcoinPendingTransactionsInputs } from './transactions-by-address.hooks';
import { useGetUtxosByAddressQuery } from './utxos-by-address.query';

export function filterUtxosWithInscriptions(
  inscriptions: InscriptionResponseItem[],
  utxos: UtxoWithDerivationPath[] | UtxoResponseItem[]
) {
  return utxos.filter(
    utxo =>
      !inscriptions?.some(
        inscription => `${utxo.txid}:${utxo.vout.toString()}` === inscription.output
      )
  );
}

export function filterUtxosWithRunes(runes: RunesOutputsByAddress[], utxos: UtxoResponseItem[]) {
  return utxos.filter(utxo => {
    const hasRuneOutput = runes.find(rune => {
      return rune.output === `${utxo.txid}:${utxo.vout}`;
    });

    return !hasRuneOutput;
  });
}

const defaultArgs = {
  filterInscriptionUtxos: true,
  filterPendingTxsUtxos: true,
  filterRunesUtxos: true,
};

/**
 * Warning: ⚠️ To avoid spending inscriptions, when using UTXOs
 * we set `filterInscriptionUtxos` and `filterPendingTxsUtxos` to true
 */
export function useCurrentNativeSegwitUtxos(args = defaultArgs) {
  const { filterInscriptionUtxos, filterPendingTxsUtxos, filterRunesUtxos } = args;

  const nativeSegwitSigner = useCurrentAccountNativeSegwitIndexZeroSigner();
  const address = nativeSegwitSigner.address;

  return useNativeSegwitUtxosByAddress({
    address,
    filterInscriptionUtxos,
    filterPendingTxsUtxos,
    filterRunesUtxos,
  });
}

interface UseFilterUtxosByAddressArgs {
  address: string;
  filterInscriptionUtxos: boolean;
  filterPendingTxsUtxos: boolean;
  filterRunesUtxos: boolean;
}

type filterUtxoFunctionType = (utxos: UtxoResponseItem[]) => UtxoResponseItem[];

export function useNativeSegwitUtxosByAddress({
  address,
  filterInscriptionUtxos,
  filterPendingTxsUtxos,
  filterRunesUtxos,
}: UseFilterUtxosByAddressArgs) {
  const { filterOutInscriptions, isInitialLoadingInscriptions } =
    useFilterInscriptionsByAddress(address);
  const { filterOutPendingTxsUtxos, isInitialLoading } = useFilterPendingUtxosByAddress(address);
  const { filterOutRunesUtxos, isInitialLoadingRunesData } = useFilterRuneUtxosByAddress(address);

  const utxosQuery = useGetUtxosByAddressQuery(address, {
    select(utxos) {
      const filters = [];
      if (filterPendingTxsUtxos) {
        filters.push(filterOutPendingTxsUtxos);
      }

      if (filterInscriptionUtxos) {
        filters.push(filterOutInscriptions);
      }

      if (filterRunesUtxos) {
        filters.push(filterOutRunesUtxos);
      }

      return filters.reduce(
        (filteredUtxos: UtxoResponseItem[], filterFunc: filterUtxoFunctionType) =>
          filterFunc(filteredUtxos),
        utxos
      );
    },
  });

  return {
    ...utxosQuery,
    isInitialLoading:
      utxosQuery.isInitialLoading ||
      isInitialLoading ||
      isInitialLoadingInscriptions ||
      isInitialLoadingRunesData,
  };
}

function useFilterInscriptionsByAddress(address: string) {
  const {
    data: inscriptionsList,
    hasNextPage: hasMoreInscriptionsToLoad,
    isLoading: isLoadingInscriptions,
    isInitialLoading: isInitialLoadingInscriptions,
  } = useInscriptionsByAddressQuery(address);

  const filterOutInscriptions = useCallback(
    (utxos: UtxoResponseItem[]) => {
      // While infinite query checks if has more data to load, or Stamps
      // are loading, assume nothing is spendable
      if (hasMoreInscriptionsToLoad || isLoadingInscriptions) return [];

      const inscriptions = inscriptionsList?.pages.flatMap(page => page.results) ?? [];

      return filterUtxosWithInscriptions(inscriptions, utxos);
    },
    [hasMoreInscriptionsToLoad, inscriptionsList?.pages, isLoadingInscriptions]
  );

  return {
    filterOutInscriptions,
    isInitialLoadingInscriptions: hasMoreInscriptionsToLoad || isInitialLoadingInscriptions,
  };
}

function useFilterRuneUtxosByAddress(address: string) {
  // TO-DO what if data is undefined?
  const { data = [], isInitialLoading } = useRunesOutputsByAddress(address);
  const runesEnabled = useRunesEnabled();

  const filterOutRunesUtxos = useCallback(
    (utxos: UtxoResponseItem[]) => {
      // If Runes are not enabled, return all utxos
      if (!runesEnabled) {
        return utxos;
      }

      return filterUtxosWithRunes(data, utxos);
    },
    [data, runesEnabled]
  );

  return {
    filterOutRunesUtxos,
    isInitialLoadingRunesData: isInitialLoading,
  };
}

function useFilterPendingUtxosByAddress(address: string) {
  const { data: pendingInputs = [], isInitialLoading } =
    useBitcoinPendingTransactionsInputs(address);

  const filterOutPendingTxsUtxos = useCallback(
    (utxos: UtxoResponseItem[]) => {
      return utxos.filter(
        utxo =>
          !pendingInputs.find(
            input => input.prevout.scriptpubkey_address === address && input.txid === utxo.txid
          )
      );
    },
    [address, pendingInputs]
  );

  return {
    filterOutPendingTxsUtxos,
    isInitialLoading,
  };
}
