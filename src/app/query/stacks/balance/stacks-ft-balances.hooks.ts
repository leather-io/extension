import { useMemo } from 'react';

import type { StacksFungibleTokenAssetBalance } from '@shared/models/crypto-asset-balance.model';

import { formatContractId, getFullyQualifiedStacksAssetName } from '@app/common/utils';
import { useCurrentStacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';

import { useGetFungibleTokenMetadataListQuery } from '../tokens/fungible-tokens/fungible-token-metadata.query';
import { isFtAsset } from '../tokens/token-metadata.utils';
import {
  addQueriedMetadataToInitializedStacksFungibleTokenAssetBalance,
  convertFtBalancesToStacksFungibleTokenAssetBalanceType,
  convertNftBalancesToStacksNonFungibleTokenAssetBalanceType,
  createStacksCryptoCurrencyAssetTypeWrapper,
} from './stacks-ft-balances.utils';
import { parseBalanceResponse } from './stx-balance.hooks';
import {
  useAnchoredStacksAccountBalanceQuery,
  useUnanchoredStacksAccountBalanceQuery,
} from './stx-balance.query';

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

function useStacksFungibleTokenAssetBalancesUnanchored(address: string) {
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
        if (!(metadata && isFtAsset(metadata))) return assetBalance;
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
        if (!(metadata && isFtAsset(metadata))) return assetBalance;
        return addQueriedMetadataToInitializedStacksFungibleTokenAssetBalance(
          assetBalance,
          metadata
        );
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [initializedAssetBalances]
  );
}

export function useStacksFungibleTokenAssetBalance(contractId: string) {
  const account = useCurrentStacksAccount();
  const assetBalances = useStacksFungibleTokenAssetBalancesUnanchoredWithMetadata(
    account?.address ?? ''
  );
  return useMemo(() => {
    if (!assetBalances.length) return;
    return assetBalances.find(assetBalance => assetBalance.asset.contractId === contractId);
  }, [assetBalances, contractId]);
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
 *
 * Remove with legacy send form.
 * @deprecated
 */
export function useStacksCryptoAssetBalanceByAssetId(selectedAssetId?: string) {
  const account = useCurrentStacksAccount();

  const { data: stxCryptoCurrencyAssetBalance } = useStacksAnchoredCryptoCurrencyAssetBalance(
    account?.address ?? ''
  );
  const stacksFtCryptoAssetBalances = useStacksFungibleTokenAssetBalancesUnanchoredWithMetadata(
    account?.address ?? ''
  );

  return useMemo(
    () => {
      if (!stxCryptoCurrencyAssetBalance) return;
      return [stxCryptoCurrencyAssetBalance, ...stacksFtCryptoAssetBalances].find(
        assetBalance => getFullyQualifiedStacksAssetName(assetBalance) === selectedAssetId
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedAssetId]
  );
}

// TODO: Remove?
// ts-unused-exports:disable-next-line
export function useStacksNonFungibleTokenAssetsUnanchored() {
  const account = useCurrentStacksAccount();
  return useUnanchoredStacksAccountBalanceQuery(account?.address ?? '', {
    select: resp =>
      convertNftBalancesToStacksNonFungibleTokenAssetBalanceType(
        parseBalanceResponse(resp).non_fungible_tokens
      ),
  });
}
