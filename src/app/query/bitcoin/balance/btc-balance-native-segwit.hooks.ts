import { useMemo } from 'react';

import BigNumber from 'bignumber.js';

import type { BtcCryptoAssetBalance, Money } from '@leather.io/models';
import { useNativeSegwitUtxosByAddress, useRunesEnabled } from '@leather.io/query';
import { createMoney, isUndefined, sumNumbers } from '@leather.io/utils';

import { useInscribedSpendableUtxos } from '@app/features/discarded-inscriptions/use-inscribed-spendable-utxos';
import { useCurrentAccountNativeSegwitIndexZeroSigner } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';

function createBtcCryptoAssetBalance(balance: Money): BtcCryptoAssetBalance {
  return {
    availableBalance: balance,
    // TODO: Can we determine these here or are they nec?
    protectedBalance: createMoney(0, 'BTC'),
    uneconomicalBalance: createMoney(0, 'BTC'),
  };
}

export function useBtcCryptoAssetBalanceNativeSegwit(address: string) {
  const runesEnabled = useRunesEnabled();

  const spendableInscriptionUtxos = useInscribedSpendableUtxos();

  const filteredUtxosQuery = useNativeSegwitUtxosByAddress({
    address,
    filterInscriptionUtxos: true,
    filterPendingTxsUtxos: true,
    filterRunesUtxos: runesEnabled,
  });

  // const filteredUtxosQuery = useNativeSegwitUtxosByAddress({
  //   address,
  //   filterInscriptionUtxos: true,
  //   filterPendingTxsUtxos: true,
  //   filterRunesUtxos: runesEnabled,
  // });

  const balance = useMemo(() => {
    if (isUndefined(filteredUtxosQuery.data))
      return createBtcCryptoAssetBalance(createMoney(new BigNumber(0), 'BTC'));
    return createBtcCryptoAssetBalance(
      createMoney(
        // Here we add back in the utxos that are spending beacuse they've been discarded
        sumNumbers(
          [...filteredUtxosQuery.data, ...spendableInscriptionUtxos].map(utxo => utxo.value)
        ),
        'BTC'
      )
    );
  }, [filteredUtxosQuery.data, spendableInscriptionUtxos]);

  return { ...filteredUtxosQuery, balance };
}

export function useCurrentBtcCryptoAssetBalanceNativeSegwit() {
  const nativeSegwitSigner = useCurrentAccountNativeSegwitIndexZeroSigner();
  return useBtcCryptoAssetBalanceNativeSegwit(nativeSegwitSigner.address);
}
