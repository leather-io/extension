import { useCallback } from 'react';

import { InscriptionResponseItem } from '@shared/models/inscription.model';

import { useCurrentAccountNativeSegwitIndexZeroSigner } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';

import { UtxoResponseItem, UtxoWithDerivationPath } from '../bitcoin-client';
import { useInscriptionsByAddressQuery } from '../ordinals/inscriptions.query';
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

const defaultArgs = {
  filterInscriptionUtxos: true,
  filterPendingTxsUtxos: true,
};

/**
 * Warning: ⚠️ To avoid spending inscriptions, when using UTXOs
 * we set `filterInscriptionUtxos` and `filterPendingTxsUtxos` to true
 */
export function useCurrentNativeSegwitUtxos(args = defaultArgs) {
  const { filterInscriptionUtxos, filterPendingTxsUtxos } = args;

  const nativeSegwitSigner = useCurrentAccountNativeSegwitIndexZeroSigner();
  const address = nativeSegwitSigner.address;

  return useNativeSegwitUtxosByAddress({
    address,
    filterInscriptionUtxos,
    filterPendingTxsUtxos,
  });
}

interface UseFilterUtxosByAddressArgs {
  address: string;
  filterInscriptionUtxos: boolean;
  filterPendingTxsUtxos: boolean;
}

type filterUtxoFunctionType = (utxos: UtxoResponseItem[]) => UtxoResponseItem[];

export function useNativeSegwitUtxosByAddress({
  address,
  filterInscriptionUtxos,
  filterPendingTxsUtxos,
}: UseFilterUtxosByAddressArgs) {
  const filterOutInscriptions = useFilterInscriptionsByAddress(address);
  const filterOutPendingTxsUtxos = useFilterPendingUtxosByAddress(address);

  return useGetUtxosByAddressQuery(address, {
    select(utxos) {
      const filters = [];
      if (filterPendingTxsUtxos) {
        filters.push(filterOutPendingTxsUtxos);
      }

      if (filterInscriptionUtxos) {
        filters.push(filterOutInscriptions);
      }

      return filters.reduce(
        (filteredUtxos: UtxoResponseItem[], filterFunc: filterUtxoFunctionType) =>
          filterFunc(filteredUtxos),
        utxos
      );
    },
  });
}

function useFilterInscriptionsByAddress(address: string) {
  const {
    data: inscriptionsList,
    hasNextPage: hasMoreInscriptionsToLoad,
    isLoading: isLoadingInscriptions,
  } = useInscriptionsByAddressQuery(address);

  return useCallback(
    (utxos: UtxoResponseItem[]) => {
      // While infinite query checks if has more data to load, or Stamps
      // are loading, assume nothing is spendable
      if (hasMoreInscriptionsToLoad || isLoadingInscriptions) return [];

      const inscriptions = inscriptionsList?.pages.flatMap(page => page.results) ?? [];

      return filterUtxosWithInscriptions(inscriptions, utxos);
    },
    [hasMoreInscriptionsToLoad, inscriptionsList?.pages, isLoadingInscriptions]
  );
}

function useFilterPendingUtxosByAddress(address: string) {
  const { data: pendingInputs = [] } = useBitcoinPendingTransactionsInputs(address);

  return useCallback(
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
}
