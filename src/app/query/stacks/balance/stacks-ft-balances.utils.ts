import { FtMetadataResponse } from '@hirosystems/token-metadata-api-client';
import { getAssetStringParts } from '@stacks/ui-utils';
import BigNumber from 'bignumber.js';

import { STX_DECIMALS } from '@shared/constants';
import type { AccountBalanceResponseBigNumber } from '@shared/models/account.model';
import type {
  StacksCryptoCurrencyAssetBalance,
  StacksFungibleTokenAssetBalance,
  StacksNonFungibleTokenAssetBalance,
} from '@shared/models/crypto-asset-balance.model';
import { createMoney } from '@shared/models/money.model';

import { isTransferableStacksFungibleTokenAsset } from '@app/common/crypto-assets/stacks-crypto-asset.utils';

export function createStacksCryptoCurrencyAssetTypeWrapper(
  balance: BigNumber
): StacksCryptoCurrencyAssetBalance {
  return {
    blockchain: 'stacks',
    type: 'crypto-currency',
    balance: createMoney(balance, 'STX'),
    asset: {
      decimals: STX_DECIMALS,
      hasMemo: true,
      name: 'Stacks',
      symbol: 'STX',
    },
  };
}

export function createStacksFtCryptoAssetBalanceTypeWrapper(
  balance: BigNumber,
  contractId: string
): StacksFungibleTokenAssetBalance {
  const { address, contractName, assetName } = getAssetStringParts(contractId);
  return {
    blockchain: 'stacks',
    type: 'fungible-token',
    balance: createMoney(balance, '', 0),
    asset: {
      contractId,
      canTransfer: false,
      contractAddress: address,
      contractAssetName: assetName,
      contractName,
      decimals: 0,
      hasMemo: false,
      imageCanonicalUri: '',
      name: '',
      symbol: '',
    },
  };
}

function createStacksNftCryptoAssetBalanceTypeWrapper(
  balance: BigNumber,
  key: string
): StacksNonFungibleTokenAssetBalance {
  const { address, contractName, assetName } = getAssetStringParts(key);
  return {
    blockchain: 'stacks',
    type: 'non-fungible-token',
    count: balance,
    asset: {
      contractAddress: address,
      contractAssetName: assetName,
      contractName,
      imageCanonicalUri: '',
      name: '',
    },
  };
}

export function convertFtBalancesToStacksFungibleTokenAssetBalanceType(
  ftBalances: AccountBalanceResponseBigNumber['fungible_tokens']
) {
  return (
    Object.entries(ftBalances)
      .map(([key, value]) => {
        const balance = new BigNumber(value.balance);
        return createStacksFtCryptoAssetBalanceTypeWrapper(balance, key);
      })
      // Assets users have traded will persist in the api response
      .filter(assetBalance => !assetBalance?.balance.amount.isEqualTo(0))
  );
}

export function convertNftBalancesToStacksNonFungibleTokenAssetBalanceType(
  nftBalances: AccountBalanceResponseBigNumber['non_fungible_tokens']
) {
  return Object.entries(nftBalances)
    .map(([key, value]) => {
      const count = new BigNumber(value.count);
      return createStacksNftCryptoAssetBalanceTypeWrapper(count, key);
    })
    .filter(assetBalance => !assetBalance?.count.isEqualTo(0));
}

export function addQueriedMetadataToInitializedStacksFungibleTokenAssetBalance(
  assetBalance: StacksFungibleTokenAssetBalance,
  metadata: FtMetadataResponse
) {
  return {
    ...assetBalance,
    balance: createMoney(
      assetBalance.balance.amount,
      metadata.symbol ?? '',
      metadata.decimals ?? 0
    ),
    asset: {
      ...assetBalance.asset,
      canTransfer: isTransferableStacksFungibleTokenAsset(assetBalance.asset),
      decimals: metadata.decimals ?? 0,
      hasMemo: isTransferableStacksFungibleTokenAsset(assetBalance.asset),
      imageCanonicalUri: metadata.image_canonical_uri ?? '',
      name: metadata.name ?? '',
      symbol: metadata.symbol ?? '',
    },
  };
}

export function getStacksFungibleTokenCurrencyAssetBalance(
  selectedAssetBalance?: StacksCryptoCurrencyAssetBalance | StacksFungibleTokenAssetBalance
) {
  return selectedAssetBalance?.type === 'fungible-token' && selectedAssetBalance.asset.canTransfer
    ? selectedAssetBalance
    : undefined;
}
