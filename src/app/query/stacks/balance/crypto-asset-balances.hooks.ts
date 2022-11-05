import { useMemo } from 'react';

import BigNumber from 'bignumber.js';

import type { StacksFungibleTokenAssetBalance } from '@shared/models/crypto-asset-balance.model';

import { formatContractId, getFullyQualifiedStacksAssetName } from '@app/common/utils';

import { useGetFungibleTokenMetadataListQuery } from '../fungible-tokens/fungible-token-metadata.query';
import {
  useCurrentAccountAnchoredBalances,
  useCurrentAccountAvailableStxBalance,
  useCurrentAccountUnanchoredBalances,
} from './balance.hooks';
import {
  addQueriedMetadataToInitializedStacksFungibleTokenAssetBalance,
  convertFtBalancesToStacksFungibleTokenAssetBalanceType,
  convertNftBalancesToStacksNonFungibleTokenAssetBalanceType,
  createStacksCryptoCurrencyAssetTypeWrapper,
  mergeStacksFungibleTokenAssetBalances,
} from './crypto-asset-balances.utils';

export function useStacksCryptoCurrencyAssetBalance() {
  const { data: balances } = useCurrentAccountUnanchoredBalances();
  const availableStxBalance = useCurrentAccountAvailableStxBalance();
  return useMemo(() => {
    const subBalance =
      balances?.stx.balance.amount.minus(balances.stx.locked.amount) ?? new BigNumber(0);
    return createStacksCryptoCurrencyAssetTypeWrapper(availableStxBalance, subBalance);
  }, [availableStxBalance, balances]);
}

function useInitializedStacksFungibleTokenAssetBalancesAnchored() {
  const { data: balances } = useCurrentAccountAnchoredBalances();
  return useMemo(() => {
    if (!balances) return [];
    return convertFtBalancesToStacksFungibleTokenAssetBalanceType(balances);
  }, [balances]);
}

function useInitialzedStacksFungibleTokenAssetBalancesUnanchored() {
  const { data: balances } = useCurrentAccountUnanchoredBalances();
  return useMemo(() => {
    if (!balances) return [];
    return convertFtBalancesToStacksFungibleTokenAssetBalanceType(balances);
  }, [balances]);
}

function useStacksFungibleTokenAssetBalancesAnchoredWithMetadata(): StacksFungibleTokenAssetBalance[] {
  const initializedAssetBalances = useInitializedStacksFungibleTokenAssetBalancesAnchored();
  const ftAssetsMetadata = useGetFungibleTokenMetadataListQuery(
    initializedAssetBalances.map(assetBalance =>
      formatContractId(assetBalance.asset.contractAddress, assetBalance.asset.contractName)
    )
  );
  return useMemo(
    () =>
      initializedAssetBalances.map((assetBalance, i) => {
        const metadata = ftAssetsMetadata[i].data;
        if (!metadata) return assetBalance;
        return addQueriedMetadataToInitializedStacksFungibleTokenAssetBalance(
          assetBalance,
          metadata
        );
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [initializedAssetBalances]
  );
}

export function useStacksFungibleTokenAssetBalancesUnanchoredWithMetadata(): StacksFungibleTokenAssetBalance[] {
  const initializedAssetBalances = useInitialzedStacksFungibleTokenAssetBalancesUnanchored();
  const ftAssetsMetadata = useGetFungibleTokenMetadataListQuery(
    initializedAssetBalances.map(assetBalance =>
      formatContractId(assetBalance.asset.contractAddress, assetBalance.asset.contractName)
    )
  );
  return useMemo(
    () =>
      // eslint-disable-next-line react-hooks/exhaustive-deps
      initializedAssetBalances.map((assetBalance, i) => {
        const metadata = ftAssetsMetadata[i].data;
        if (!metadata) return assetBalance;
        return addQueriedMetadataToInitializedStacksFungibleTokenAssetBalance(
          assetBalance,
          metadata
        );
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [initializedAssetBalances]
  );
}

export function useStacksFungibleTokenAssetBalances() {
  const anchoredAssetBalances = useStacksFungibleTokenAssetBalancesAnchoredWithMetadata();
  const unanchoredAssetBalances = useStacksFungibleTokenAssetBalancesUnanchoredWithMetadata();

  return useMemo(
    () => mergeStacksFungibleTokenAssetBalances(anchoredAssetBalances, unanchoredAssetBalances),
    [anchoredAssetBalances, unanchoredAssetBalances]
  );
}

export function useTransferableStacksFungibleTokenAssetBalances(): StacksFungibleTokenAssetBalance[] {
  const assetBalances = useStacksFungibleTokenAssetBalancesUnanchoredWithMetadata();
  return useMemo(
    () => assetBalances.filter(assetBalance => assetBalance.asset.canTransfer),
    [assetBalances]
  );
}

export function useSelectedStacksCryptoAssetBalance(selectedAssetId: string) {
  const stxCryptoCurrencyAssetBalance = useStacksCryptoCurrencyAssetBalance();
  const stacksFtCryptoAssetBalances = useStacksFungibleTokenAssetBalancesUnanchoredWithMetadata();

  return useMemo(
    () =>
      [stxCryptoCurrencyAssetBalance, ...stacksFtCryptoAssetBalances].find(
        assetBalance => getFullyQualifiedStacksAssetName(assetBalance) === selectedAssetId
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedAssetId]
  );
}

export function useStacksNonFungibleTokenAssetsUnanchored() {
  const { data: balances } = useCurrentAccountUnanchoredBalances();
  return useMemo(() => {
    if (!balances) return [];
    return convertNftBalancesToStacksNonFungibleTokenAssetBalanceType(balances);
  }, [balances]);
}
