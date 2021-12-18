import { memo, useMemo, forwardRef, useEffect, useRef, FormEvent } from 'react';
import { Box, Fade, Text, Flex, Input, color, Stack, StackProps } from '@stacks/ui';
import { useCombobox } from 'downshift';

import {
  useSearchInput,
  useTransferableAssets,
  useUpdateSearchInput,
} from '@store/assets/asset.hooks';
import { useSelectedAsset } from '@common/hooks/use-selected-asset';
import { AssetRow } from '@components/asset-row';
import { AssetWithMeta } from '@common/asset-types';
import { useCurrentAccountAvailableStxBalance } from '@store/accounts/account.hooks';
import { SelectedAsset } from './selected-asset';

function principalHasOnlyOneAsset(assets: AssetWithMeta[]) {
  return assets.length === 1;
}
interface AssetSearchResultsProps extends StackProps {
  isOpen: boolean;
  highlightedIndex: number;
  getItemProps: any;
}
const AssetSearchResults = forwardRef(
  ({ isOpen, highlightedIndex, getItemProps, ...props }: AssetSearchResultsProps, ref) => {
    const assets = useTransferableAssets();
    const searchInput = useSearchInput();
    const availableStxBalance = useCurrentAccountAvailableStxBalance();

    const items = useMemo(
      () =>
        assets?.filter(item => item.name.toLowerCase().includes(searchInput.toLowerCase() || '')),
      [assets, searchInput]
    );

    if (!assets) return null;

    return (
      <Fade in={isOpen && !!items?.length}>
        {styles => (
          <Stack
            flexDirection="column"
            boxShadow="0px 8px 16px rgba(27, 39, 51, 0.08);"
            borderRadius="6px"
            position="absolute"
            width="100%"
            top="77px"
            maxHeight="230px"
            border={isOpen ? '1px solid #E1E3E8' : 'none'}
            zIndex={1000}
            overflow="auto"
            style={styles}
            spacing="extra-loose"
            bg={color('bg')}
            p="loose"
            ref={ref}
            {...props}
          >
            {items?.map((asset, index) => {
              const isStx = asset.type === 'stx';
              if (isStx && !availableStxBalance) return null;
              return (
                <AssetRow
                  isPressable
                  asset={asset}
                  index={index}
                  key={`${asset.contractAddress || asset.name}__${index}`}
                  highlighted={highlightedIndex === index ? 'ink.150' : 'white'}
                  {...getItemProps({ item: asset, index })}
                />
              );
            })}
          </Stack>
        )}
      </Fade>
    );
  }
);
const AssetSearchField = memo(
  ({ autoFocus, onItemClick, ...rest }: { autoFocus?: boolean; onItemClick: () => void }) => {
    const assets = useTransferableAssets();

    const { selectedAsset, handleUpdateSelectedAsset } = useSelectedAsset();

    const searchInput = useSearchInput();
    const setSearchInput = useUpdateSearchInput();

    useEffect(() => {
      if (principalHasOnlyOneAsset(assets ?? [])) {
        handleUpdateSelectedAsset(assets[0]);
      }
    }, [assets, handleUpdateSelectedAsset]);

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
      items: assets || [],
      initialIsOpen: true,
      inputValue: searchInput,
      defaultIsOpen: false,
      selectedItem: selectedAsset,
      itemToString: item => {
        return item?.contractAddress || item?.name || '';
      },
      onSelectedItemChange: ({ selectedItem }) => {
        onItemClick();
        handleUpdateSelectedAsset(selectedItem || undefined);
      },
    });

    const labelRef = useRef(null);
    const comboRef = useRef(null);

    if (!assets) return null;

    return (
      <Flex flexDirection="column" width="100%" position="relative" overflow="visible" {...rest}>
        <Box width="100%">
          <Text
            as="label"
            display="block"
            mb="tight"
            fontSize={1}
            fontWeight="500"
            htmlFor="amount"
            {...getLabelProps({ ref: labelRef })}
          >
            Choose an asset
          </Text>
        </Box>
        <Box width="100%" {...getComboboxProps({ ref: comboRef })}>
          <Input
            {...getInputProps()}
            onChange={(e: FormEvent<HTMLInputElement>) => {
              const { value } = e.currentTarget;
              setSearchInput(value);
            }}
            width="100%"
            placeholder="Search for an asset"
            onFocus={() => {
              openMenu();
            }}
            autoFocus={autoFocus}
          />
        </Box>
        <AssetSearchResults
          highlightedIndex={highlightedIndex}
          getItemProps={getItemProps}
          isOpen={isOpen}
          {...getMenuProps()}
        />
      </Flex>
    );
  }
);

interface AssetSearchProps {
  autoFocus?: boolean;
  onItemClick(): void;
}
export const AssetSearch: React.FC<AssetSearchProps> = memo(
  ({ autoFocus, onItemClick, ...rest }) => {
    const { selectedAsset } = useSelectedAsset();
    const assets = useTransferableAssets();

    if (!assets) {
      return (
        <Stack spacing="tight" {...rest}>
          <Box height="16px" width="68px" bg={color('bg-4')} borderRadius="8px" />
          <Box height="48px" width="100%" bg={color('bg-4')} borderRadius="8px" />
        </Stack>
      );
    }

    if (selectedAsset) {
      return <SelectedAsset {...rest} hideArrow={principalHasOnlyOneAsset(assets ?? [])} />;
    }

    return <AssetSearchField onItemClick={onItemClick} autoFocus={autoFocus} {...rest} />;
  }
);
