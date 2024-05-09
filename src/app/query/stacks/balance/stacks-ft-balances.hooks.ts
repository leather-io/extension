import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import BigNumber from 'bignumber.js';

import type { StacksFungibleTokenAssetBalance } from '@shared/models/crypto-asset-balance.model';

import { formatContractId } from '@app/common/utils';
import { useToast } from '@app/features/toasts/use-toast';
import {
  type SwapAsset,
  useAlexCurrencyPriceAsMarketData,
  useAlexSwappableAssets,
} from '@app/query/common/alex-sdk/alex-sdk.hooks';
import { useCurrentStacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';

import { useGetFungibleTokenMetadataListQuery } from '../tokens/fungible-tokens/fungible-token-metadata.query';
import { isFtAsset } from '../tokens/token-metadata.utils';
import {
  addQueriedMetadataToInitializedStacksFungibleTokenAssetBalance,
  convertFtBalancesToStacksFungibleTokenAssetBalanceType,
  createStacksFtCryptoAssetBalanceTypeWrapper,
} from './stacks-ft-balances.utils';
import { useStacksAccountBalanceQuery } from './stx-balance.query';

function useStacksFungibleTokenAssetBalances(address: string) {
  return useStacksAccountBalanceQuery(address, {
    select: resp => convertFtBalancesToStacksFungibleTokenAssetBalanceType(resp.fungible_tokens),
  });
}

function useStacksFungibleTokenAssetBalancesWithMetadata(address: string) {
  const { data: initializedAssetBalances = [] } = useStacksFungibleTokenAssetBalances(address);
  const priceAsMarketData = useAlexCurrencyPriceAsMarketData();

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
          metadata,
          priceAsMarketData(
            formatContractId(assetBalance.asset.contractAddress, assetBalance.asset.contractName),
            metadata.symbol
          )
        );
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [initializedAssetBalances]
  );
}

export function useStacksFungibleTokenAssetBalance(contractId: string) {
  const toast = useToast();
  const account = useCurrentStacksAccount();
  const navigate = useNavigate();
  const assetBalances = useStacksFungibleTokenAssetBalancesWithMetadata(account?.address ?? '');

  return useMemo(() => {
    const balance = assetBalances.find(assetBalance =>
      assetBalance.asset.contractId.includes(contractId)
    );
    if (!balance) {
      toast.error('Unable to find balance by contract id');
      navigate('..');
    }
    return balance ?? createStacksFtCryptoAssetBalanceTypeWrapper(new BigNumber(0), contractId);
  }, [assetBalances, contractId, navigate, toast]);
}

export function useTransferableStacksFungibleTokenAssetBalances(
  address: string
): StacksFungibleTokenAssetBalance[] {
  const assetBalances = useStacksFungibleTokenAssetBalancesWithMetadata(address);
  return useMemo(
    () => assetBalances.filter(assetBalance => assetBalance.asset.canTransfer),
    [assetBalances]
  );
}

function filterStacksFungibleTokens(
  assetBalances: StacksFungibleTokenAssetBalance[],
  swapAssets: SwapAsset[],
  filter: StacksFtTokensFilter
) {
  if (filter === 'supported') {
    return assetBalances.filter(assetBalance =>
      swapAssets.some(swapAsset => swapAsset.principal.includes(assetBalance.asset.contractAddress))
    );
  }

  if (filter === 'unsupported') {
    return assetBalances.filter(
      assetBalance =>
        !swapAssets.some(swapAsset =>
          swapAsset.principal.includes(assetBalance.asset.contractAddress)
        )
    );
  }

  return assetBalances;
}

/**
 * @see https://github.com/leather-wallet/issues/issues/16
 */
type StacksFtTokensFilter = 'all' | 'supported' | 'unsupported';

interface useFilteredStacksFungibleTokenListArgs {
  address: string;
  filter?: StacksFtTokensFilter;
}
export function useFilteredStacksFungibleTokenList({
  address,
  filter = 'all',
}: useFilteredStacksFungibleTokenListArgs) {
  const stacksFtAssetBalances = useStacksFungibleTokenAssetBalancesWithMetadata(address);
  const { data: swapAssets = [] } = useAlexSwappableAssets();

  return useMemo(() => {
    return filterStacksFungibleTokens(stacksFtAssetBalances, swapAssets, filter);
  }, [stacksFtAssetBalances, swapAssets, filter]);
}
