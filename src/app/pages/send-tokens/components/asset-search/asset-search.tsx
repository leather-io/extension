import { memo, useEffect, useState } from 'react';

import { Box, Stack, color } from '@stacks/ui';
import { useField } from 'formik';

import type {
  StacksCryptoCurrencyAssetBalance,
  StacksFungibleTokenAssetBalance,
} from '@shared/models/crypto-asset-balance.model';

import { useSelectedAssetBalance } from '@app/pages/send-tokens/hooks/use-selected-asset-balance';
import { useCurrentAccountAnchoredBalances } from '@app/query/stacks/balance/balance.hooks';
import {
  useStacksCryptoCurrencyAssetBalance,
  useTransferableStacksFungibleTokenAssetBalances,
} from '@app/query/stacks/balance/crypto-asset-balances.hooks';

import { AssetSearchField } from './asset-search-field';
import { SelectedAsset } from './selected-asset';

function principalHasNoFungibleTokenAssets(assets: StacksFungibleTokenAssetBalance[]) {
  return assets.length === 0;
}

interface AssetSearchProps {
  autoFocus?: boolean;
  onSelectAssetBalance(
    assetBalance: StacksCryptoCurrencyAssetBalance | StacksFungibleTokenAssetBalance
  ): void;
}
export const AssetSearch: React.FC<AssetSearchProps> = memo(
  ({ autoFocus, onSelectAssetBalance, ...rest }) => {
    const [field, _, helpers] = useField('assetId');
    const stxCryptoCurrencyAssetBalance = useStacksCryptoCurrencyAssetBalance();
    const stacksFtAssetBalances = useTransferableStacksFungibleTokenAssetBalances();
    const allAssetBalances = [stxCryptoCurrencyAssetBalance, ...stacksFtAssetBalances];
    const { data: balance } = useCurrentAccountAnchoredBalances();
    const { selectedAssetBalance } = useSelectedAssetBalance(field.value);
    const [searchInput, setSearchInput] = useState<string>('');
    const [assetBalanceItems, setAssetBalanceItems] = useState(allAssetBalances);

    useEffect(() => {
      if (principalHasNoFungibleTokenAssets(stacksFtAssetBalances)) {
        onSelectAssetBalance(allAssetBalances[0]);
      }
      return () => onClearSearch();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onClearSearch = () => {
      setSearchInput('');
      setAssetBalanceItems(allAssetBalances);
      helpers.setValue('');
    };

    const onInputValueChange = (value: string | undefined) => {
      if (!value) {
        onClearSearch();
        return;
      }
      setSearchInput(value);
      setAssetBalanceItems(
        allAssetBalances.filter(assetBalance =>
          assetBalance.asset.name.toLowerCase().includes(value.toLowerCase())
        )
      );
    };

    if (!allAssetBalances.length) {
      return (
        <Stack spacing="tight" {...rest}>
          <Box height="16px" width="68px" bg={color('bg-4')} borderRadius="8px" />
          <Box height="48px" width="100%" bg={color('bg-4')} borderRadius="8px" />
        </Stack>
      );
    }

    if (field.value) {
      return (
        <SelectedAsset
          hideArrow={principalHasNoFungibleTokenAssets(stacksFtAssetBalances)}
          onClearSearch={onClearSearch}
          {...rest}
        />
      );
    }

    return (
      <AssetSearchField
        assetBalances={assetBalanceItems}
        autoFocus={autoFocus}
        hasStxBalance={!!balance?.stx.availableStx.amount.isGreaterThan(0)}
        onInputValueChange={onInputValueChange}
        onSelectedItemChange={onSelectAssetBalance}
        searchInput={searchInput}
        selectedAssetBalance={selectedAssetBalance}
        {...rest}
      />
    );
  }
);
