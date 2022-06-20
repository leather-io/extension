import { memo, useEffect, useState } from 'react';
import { Box, color, Stack } from '@stacks/ui';

import { AssetWithMeta } from '@app/common/asset-types';
import { useTransferableAssets } from '@app/store/assets/asset.hooks';
import { useSelectedAsset } from '@app/pages/send-tokens/hooks/use-selected-asset';
import { useCurrentAccountAvailableStxBalance } from '@app/store/accounts/account.hooks';

import { AssetSearchField } from './asset-search-field';
import { SelectedAsset } from './selected-asset';

function principalHasOnlyOneAsset(assets: AssetWithMeta[]) {
  return assets.length === 1;
}

interface AssetSearchProps {
  autoFocus?: boolean;
  onSelectAssetResetForm(): void;
}
export const AssetSearch: React.FC<AssetSearchProps> = memo(
  ({ autoFocus, onSelectAssetResetForm, ...rest }) => {
    const assets = useTransferableAssets();
    const availableStxBalance = useCurrentAccountAvailableStxBalance();
    const { selectedAsset, updateSelectedAsset } = useSelectedAsset();
    const [searchInput, setSearchInput] = useState<string>('');
    const [assetItems, setAssetItems] = useState(assets);

    useEffect(() => {
      if (principalHasOnlyOneAsset(assets ?? [])) {
        updateSelectedAsset(assets[0]);
      }
      return () => onClearSearch();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onClearSearch = () => {
      setSearchInput('');
      updateSelectedAsset(undefined);
    };

    const onInputValueChange = (value: string | undefined) => {
      if (!value) {
        setSearchInput('');
        return;
      }
      setSearchInput(value);
      setAssetItems(assets.filter(asset => asset.name.toLowerCase().includes(value.toLowerCase())));
    };

    const onSelectedItemChange = (item: any) => {
      updateSelectedAsset(item || undefined);
      onSelectAssetResetForm();
    };

    if (!assets) {
      return (
        <Stack spacing="tight" {...rest}>
          <Box height="16px" width="68px" bg={color('bg-4')} borderRadius="8px" />
          <Box height="48px" width="100%" bg={color('bg-4')} borderRadius="8px" />
        </Stack>
      );
    }

    if (selectedAsset) {
      return (
        <SelectedAsset
          hideArrow={principalHasOnlyOneAsset(assets ?? [])}
          onClearSearch={onClearSearch}
          {...rest}
        />
      );
    }

    return (
      <AssetSearchField
        assets={assetItems}
        autoFocus={autoFocus}
        hasStxBalance={!!availableStxBalance}
        onInputValueChange={onInputValueChange}
        onSelectedItemChange={onSelectedItemChange}
        searchInput={searchInput}
        selectedAsset={selectedAsset}
        {...rest}
      />
    );
  }
);
