import { useMemo } from 'react';

import BigNumber from 'bignumber.js';

import type { StacksFungibleTokenAssetBalance } from '@shared/models/crypto-asset-balance.model';

import { formatContractId, getFullyQualifiedStacksAssetName } from '@app/common/utils';
import { useCurrentAccount } from '@app/store/accounts/account.hooks';

import { useGetFungibleTokenMetadataListQuery } from '../fungible-tokens/fungible-token-metadata.query';
import {
  parseBalanceResponse,
  useAnchoredStacksBalances,
  useUnanchoredStacksBalances,
} from './balance.hooks';
import { useStacksAccountBalanceQuery } from './balance.query';
import {
  addQueriedMetadataToInitializedStacksFungibleTokenAssetBalance,
  convertFtBalancesToStacksFungibleTokenAssetBalanceType,
  convertNftBalancesToStacksNonFungibleTokenAssetBalanceType,
  createStacksCryptoCurrencyAssetTypeWrapper,
  mergeStacksFungibleTokenAssetBalances,
} from './crypto-asset-balances.utils';

export function useStacksCryptoCurrencyAssetBalance(address: string) {
  const { data: stacksUnanchoredBalances } = useUnanchoredStacksBalances(address);
  const { data: stacksBalances } = useAnchoredStacksBalances(address);

  return useMemo(
    () =>
      createStacksCryptoCurrencyAssetTypeWrapper(
        stacksBalances?.stx.availableStx.amount ?? new BigNumber(0),
        stacksUnanchoredBalances?.stx.availableStx.amount ?? new BigNumber(0)
      ),
    [stacksBalances, stacksUnanchoredBalances]
  );
}

function useInitializedStacksFungibleTokenAssetBalancesAnchored(address: string) {
  const { data: balances } = useAnchoredStacksBalances(address);
  return useMemo(() => {
    if (!balances) return [];
    return convertFtBalancesToStacksFungibleTokenAssetBalanceType(balances.fungible_tokens);
  }, [balances]);
}

export function useStacksFungibleTokenAssetBalancesUnanchored(address: string) {
  const { data: balances } = useUnanchoredStacksBalances(address);
  return useMemo(() => {
    if (!balances) return [];
    return convertFtBalancesToStacksFungibleTokenAssetBalanceType(balances.fungible_tokens);
  }, [balances]);
}

function useStacksFungibleTokenAssetBalancesAnchoredWithMetadata(address: string) {
  const initializedAssetBalances = useInitializedStacksFungibleTokenAssetBalancesAnchored(address);
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

// used in one place for length
function useStacksFungibleTokenAssetBalancesUnanchoredWithMetadata(
  address: string
): StacksFungibleTokenAssetBalance[] {
  const initializedAssetBalances = useStacksFungibleTokenAssetBalancesUnanchored(address);
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

export function useStacksFungibleTokenAssetBalances(address: string) {
  const anchoredAssetBalances = useStacksFungibleTokenAssetBalancesAnchoredWithMetadata(address);
  const unanchoredAssetBalances =
    useStacksFungibleTokenAssetBalancesUnanchoredWithMetadata(address);

  return useMemo(
    () => mergeStacksFungibleTokenAssetBalances(anchoredAssetBalances, unanchoredAssetBalances),
    [anchoredAssetBalances, unanchoredAssetBalances]
  );
}

export function useTransferableStacksFungibleTokenAssetBalances(
  address: string
): StacksFungibleTokenAssetBalance[] {
  const assetBalances = useStacksFungibleTokenAssetBalancesUnanchoredWithMetadata(address);
  return useMemo(
    () => assetBalances.filter(assetBalance => assetBalance.asset.canTransfer),
    [assetBalances]
  );
}

export function useSelectedStacksCryptoAssetBalance(selectedAssetId: string) {
  const account = useCurrentAccount();
  const stxCryptoCurrencyAssetBalance = useStacksCryptoCurrencyAssetBalance(account?.address ?? '');
  const stacksFtCryptoAssetBalances = useStacksFungibleTokenAssetBalancesUnanchoredWithMetadata(
    account?.address ?? ''
  );

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
  const account = useCurrentAccount();
  return useStacksAccountBalanceQuery(account?.address ?? '', {
    select: resp =>
      convertNftBalancesToStacksNonFungibleTokenAssetBalanceType(
        parseBalanceResponse(resp).non_fungible_tokens
      ),
  });
}
