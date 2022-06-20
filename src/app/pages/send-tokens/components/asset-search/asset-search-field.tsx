import { useRef } from 'react';
import { useCombobox } from 'downshift';
import { Box, Text, Flex, Input } from '@stacks/ui';

import { AssetWithMeta } from '@app/common/asset-types';

import { AssetSearchResults } from './asset-search-results';

interface AssetSearchFieldProps {
  assets: AssetWithMeta[];
  autoFocus?: boolean;
  hasStxBalance: boolean;
  onInputValueChange(value: string | undefined): void;
  onSelectedItemChange(item: any): void;
  searchInput: string;
  selectedAsset: AssetWithMeta;
}
export const AssetSearchField = ({
  assets,
  autoFocus,
  hasStxBalance,
  onInputValueChange,
  onSelectedItemChange,
  searchInput,
  selectedAsset,
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
    items: assets,
    initialIsOpen: true,
    inputValue: searchInput,
    defaultIsOpen: false,
    selectedItem: selectedAsset as any,
    itemToString: item => {
      return item?.contractAddress || item?.name || '';
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
          data-testid={`asset-select`}
          onFocus={() => openMenu()}
          placeholder="Search for an asset"
          width="100%"
          {...getInputProps()}
        />
      </Box>

      <AssetSearchResults
        assets={assets}
        getItemProps={getItemProps}
        hasStxBalance={hasStxBalance}
        highlightedIndex={highlightedIndex}
        isOpen={isOpen}
        {...getMenuProps()}
      />
    </Flex>
  );
};
