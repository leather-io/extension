import { FungibleTokenMetadata } from '@stacks/stacks-blockchain-api-types';
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
import { formatContractId } from '@app/common/utils';

export function createStacksCryptoCurrencyAssetTypeWrapper(
  balance: BigNumber,
  subBalance: BigNumber
): StacksCryptoCurrencyAssetBalance {
  return {
    blockchain: 'stacks',
    balance: createMoney(balance, 'STX'),
    type: 'crypto-currency',
    asset: {
      decimals: STX_DECIMALS,
      hasMemo: true,
      name: 'Stacks',
      symbol: 'STX',
    },
    subBalance: createMoney(subBalance, 'STX'),
  };
}

function createStacksFtCryptoAssetBalanceTypeWrapper(
  balance: BigNumber,
  key: string
): StacksFungibleTokenAssetBalance {
  const { address, contractName, assetName } = getAssetStringParts(key);
  return {
    blockchain: 'stacks',
    type: 'fungible-token',
    balance: createMoney(balance, '', 0),
    asset: {
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
    subBalance: createMoney(new BigNumber(0), '', 0),
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
  const assetBalances = Object.entries(ftBalances).map(([key, value]) => {
    const balance = new BigNumber(value.balance);
    return createStacksFtCryptoAssetBalanceTypeWrapper(balance, key);
  });
  // Assets users have traded will persist in the api response
  return assetBalances.filter(assetBalance => !assetBalance?.balance.amount.isEqualTo(0));
}

export function convertNftBalancesToStacksNonFungibleTokenAssetBalanceType(
  nftBalances: AccountBalanceResponseBigNumber['non_fungible_tokens']
) {
  const assetBalances = Object.entries(nftBalances).map(([key, value]) => {
    const count = new BigNumber(value.count);
    return createStacksNftCryptoAssetBalanceTypeWrapper(count, key);
  });
  return assetBalances.filter(assetBalance => !assetBalance?.count.isEqualTo(0));
}

export function addQueriedMetadataToInitializedStacksFungibleTokenAssetBalance(
  assetBalance: StacksFungibleTokenAssetBalance,
  metadata: FungibleTokenMetadata
) {
  return {
    ...assetBalance,
    balance: createMoney(
      assetBalance.balance.amount,
      metadata.symbol ?? '',
      metadata.decimals ?? undefined
    ),
    asset: {
      ...assetBalance.asset,
      canTransfer: isTransferableStacksFungibleTokenAsset(assetBalance.asset),
      decimals: metadata.decimals,
      hasMemo: isTransferableStacksFungibleTokenAsset(assetBalance.asset),
      imageCanonicalUri: metadata.image_canonical_uri,
      name: metadata.name,
      symbol: metadata.symbol,
    },
  };
}

export function mergeStacksFungibleTokenAssetBalances(
  anchoredAssetBalances: StacksFungibleTokenAssetBalance[],
  unanchoredAssetBalances: StacksFungibleTokenAssetBalance[]
): StacksFungibleTokenAssetBalance[] {
  return anchoredAssetBalances.map(anchoredAssetBalance => {
    const anchoredContractId = formatContractId(
      anchoredAssetBalance.asset.contractAddress,
      anchoredAssetBalance.asset.contractAssetName
    );
    const unanchoredSameAssetBalance = unanchoredAssetBalances.find(
      unanchoredAssetBalance =>
        formatContractId(
          unanchoredAssetBalance.asset.contractAddress,
          unanchoredAssetBalance.asset.contractAssetName
        ) === anchoredContractId
    );
    return {
      ...anchoredAssetBalance,
      subBalance: unanchoredSameAssetBalance?.balance ?? anchoredAssetBalance.balance,
    };
  });
}

export function getStacksFungibleTokenCurrencyAssetBalance(
  selectedAssetBalance?: StacksCryptoCurrencyAssetBalance | StacksFungibleTokenAssetBalance
) {
  return selectedAssetBalance?.type === 'fungible-token' && selectedAssetBalance.asset.canTransfer
    ? selectedAssetBalance
    : undefined;
}
