import { memo, useEffect, useState } from 'react';
import { useField } from 'formik';
import { Box, color, Stack } from '@stacks/ui';

import { AssetWithMeta } from '@app/common/asset-types';
import { useTransferableAssets } from '@app/store/assets/asset.hooks';
import { useSelectedAsset } from '@app/pages/send-tokens/hooks/use-selected-asset';
import { useCurrentAccountAvailableStxBalance } from '@app/query/balance/balance.hooks';

import { AssetSearchField } from './asset-search-field';
import { SelectedAsset } from './selected-asset';

function principalHasOnlyOneAsset(assets: AssetWithMeta[]) {
  return assets.length === 1;
}

interface AssetSearchProps {
  autoFocus?: boolean;
  onSelectAsset(asset: AssetWithMeta): void;
}
export const AssetSearch: React.FC<AssetSearchProps> = memo(
  ({ autoFocus, onSelectAsset, ...rest }) => {
    const [field, _, helpers] = useField('assetId');
    const assets = useTransferableAssets();
    const availableStxBalance = useCurrentAccountAvailableStxBalance();
    const { selectedAsset } = useSelectedAsset(field.value);
    const [searchInput, setSearchInput] = useState<string>('');
    const [assetItems, setAssetItems] = useState(assets);

    useEffect(() => {
      if (principalHasOnlyOneAsset(assets ?? [])) {
        onSelectAsset(assets[0]);
      }
      return () => onClearSearch();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onClearSearch = () => {
      setSearchInput('');
      setAssetItems(assets);
      helpers.setValue('');
    };

    const onInputValueChange = (value: string | undefined) => {
      if (!value) {
        setSearchInput('');
        return;
      }
      setSearchInput(value);
      setAssetItems(assets.filter(asset => asset.name.toLowerCase().includes(value.toLowerCase())));
    };

    if (!assets) {
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
        onSelectedItemChange={onSelectAsset}
        searchInput={searchInput}
        selectedAsset={selectedAsset}
        {...rest}
      />
    );
  }
);
