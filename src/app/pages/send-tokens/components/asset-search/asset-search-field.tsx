import { useRef } from 'react';

import { Box, Flex, Input, Text } from '@stacks/ui';
import { SendFormSelectors } from '@tests-legacy/page-objects/send-form.selectors';
import { useCombobox } from 'downshift';

import type {
  StacksCryptoCurrencyAssetBalance,
  StacksFungibleTokenAssetBalance,
} from '@shared/models/crypto-asset-balance.model';

import { AssetSearchResults } from './asset-search-results';

interface AssetSearchFieldProps {
  assetBalances: (StacksCryptoCurrencyAssetBalance | StacksFungibleTokenAssetBalance)[];
  autoFocus?: boolean;
  hasStxBalance: boolean;
  onInputValueChange(value: string | undefined): void;
  onSelectedItemChange(item: any): void;
  searchInput: string;
  selectedAssetBalance?: StacksCryptoCurrencyAssetBalance | StacksFungibleTokenAssetBalance;
}
export const AssetSearchField = ({
  assetBalances,
  autoFocus,
  hasStxBalance,
  onInputValueChange,
  onSelectedItemChange,
  searchInput,
  selectedAssetBalance,
}: AssetSearchFieldProps) => {
  const {
    isOpen,
    getLabelProps,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
    openMenu,
  } = useCombobox({
    items: assetBalances,
    initialIsOpen: true,
    inputValue: searchInput,
    defaultIsOpen: false,
    selectedItem: selectedAssetBalance as any,
    itemToString: item => {
      return item ? item.asset.name : '';
    },
    onInputValueChange: ({ inputValue }) => {
      onInputValueChange(inputValue);
    },
    onSelectedItemChange: ({ selectedItem }) => {
      onSelectedItemChange(selectedItem);
    },
  });

  const labelRef = useRef(null);
  const comboRef = useRef(null);

  return (
    <Flex flexDirection="column" width="100%" position="relative" overflow="visible">
      <Box width="100%">
        <Text
          as="label"
          display="block"
          fontSize={1}
          fontWeight="500"
          htmlFor="amount"
          mb="tight"
          {...getLabelProps({ ref: labelRef })}
        >
          Choose an asset
        </Text>
      </Box>
      <Box width="100%" {...getComboboxProps({ ref: comboRef })}>
        <Input
          autoFocus={autoFocus}
          data-testid={SendFormSelectors.AssetSelect}
          onFocus={() => openMenu()}
          placeholder="Search for an asset"
          width="100%"
          {...getInputProps()}
        />
        <AssetSearchResults
          assetBalances={assetBalances}
          getItemProps={getItemProps}
          hasStxBalance={hasStxBalance}
          highlightedIndex={highlightedIndex}
          isOpen={isOpen}
          {...getMenuProps()}
        />
      </Box>
    </Flex>
  );
};
