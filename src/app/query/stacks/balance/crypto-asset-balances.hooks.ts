import { useMemo } from 'react';

import type { StacksFungibleTokenAssetBalance } from '@shared/models/crypto-asset-balance.model';

import { formatContractId, getFullyQualifiedStacksAssetName } from '@app/common/utils';
import { useCurrentAccount } from '@app/store/accounts/account.hooks';

import { useGetFungibleTokenMetadataListQuery } from '../fungible-tokens/fungible-token-metadata.query';
import { parseBalanceResponse } from './balance.hooks';
import {
  useAnchoredStacksAccountBalanceQuery,
  useUnanchoredStacksAccountBalanceQuery,
} from './balance.query';
import {
  addQueriedMetadataToInitializedStacksFungibleTokenAssetBalance,
  convertFtBalancesToStacksFungibleTokenAssetBalanceType,
  convertNftBalancesToStacksNonFungibleTokenAssetBalanceType,
  createStacksCryptoCurrencyAssetTypeWrapper,
} from './crypto-asset-balances.utils';

export function useStacksAnchoredCryptoCurrencyAssetBalance(address: string) {
  return useAnchoredStacksAccountBalanceQuery(address, {
    select: resp =>
      createStacksCryptoCurrencyAssetTypeWrapper(
        parseBalanceResponse(resp).stx.availableStx.amount
      ),
  });
}
export function useStacksUnanchoredCryptoCurrencyAssetBalance(address: string) {
  return useUnanchoredStacksAccountBalanceQuery(address, {
    select: resp =>
      createStacksCryptoCurrencyAssetTypeWrapper(
        parseBalanceResponse(resp).stx.availableStx.amount
      ),
  });
}

function useStacksFungibleTokenAssetBalancesAnchored(address: string) {
  return useAnchoredStacksAccountBalanceQuery(address, {
    select: resp => convertFtBalancesToStacksFungibleTokenAssetBalanceType(resp.fungible_tokens),
  });
}

export function useStacksFungibleTokenAssetBalancesUnanchored(address: string) {
  return useUnanchoredStacksAccountBalanceQuery(address, {
    select: resp => convertFtBalancesToStacksFungibleTokenAssetBalanceType(resp.fungible_tokens),
  });
}

export function useStacksFungibleTokenAssetBalancesAnchoredWithMetadata(address: string) {
  const { data: initializedAssetBalances = [] } =
    useStacksFungibleTokenAssetBalancesAnchored(address);

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

function useStacksFungibleTokenAssetBalancesUnanchoredWithMetadata(
  address: string
): StacksFungibleTokenAssetBalance[] {
  const { data: initializedAssetBalances = [] } =
    useStacksFungibleTokenAssetBalancesUnanchored(address);
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

export function useTransferableStacksFungibleTokenAssetBalances(
  address: string
): StacksFungibleTokenAssetBalance[] {
  const assetBalances = useStacksFungibleTokenAssetBalancesUnanchoredWithMetadata(address);
  return useMemo(
    () => assetBalances.filter(assetBalance => assetBalance.asset.canTransfer),
    [assetBalances]
  );
}

/**
 * Use caution with this hook, is incredibly expensive. To get an asset's
 * balance, we query all balances metadata (possibly hundreds) and then search
 * the results.
 * @deprecated
 */
export function useStacksCryptoAssetBalanceByAssetId(selectedAssetId: string) {
  const account = useCurrentAccount();

  const { data: stxCryptoCurrencyAssetBalance } = useStacksAnchoredCryptoCurrencyAssetBalance(
    account?.address ?? ''
  );
  const stacksFtCryptoAssetBalances = useStacksFungibleTokenAssetBalancesUnanchoredWithMetadata(
    account?.address ?? ''
  );

  return useMemo(
    () => {
      if (!stxCryptoCurrencyAssetBalance) return undefined;
      return [stxCryptoCurrencyAssetBalance, ...stacksFtCryptoAssetBalances].find(
        assetBalance => getFullyQualifiedStacksAssetName(assetBalance) === selectedAssetId
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedAssetId]
  );
}

export function useStacksNonFungibleTokenAssetsUnanchored() {
  const account = useCurrentAccount();
  return useUnanchoredStacksAccountBalanceQuery(account?.address ?? '', {
    select: resp =>
      convertNftBalancesToStacksNonFungibleTokenAssetBalanceType(
        parseBalanceResponse(resp).non_fungible_tokens
      ),
  });
}
