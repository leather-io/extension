import { forwardRef } from 'react';
import { Fade, color, Stack, StackProps } from '@stacks/ui';

import { AssetRow } from '@app/components/asset-row';
import { AssetWithMeta } from '@app/common/asset-types';

interface AssetSearchResultsProps extends StackProps {
  assets: AssetWithMeta[];
  getItemProps: any;
  hasStxBalance: boolean;
  highlightedIndex: number;
  isOpen: boolean;
}

export const AssetSearchResults = forwardRef(
  (
    {
      assets,
      getItemProps,
      hasStxBalance,
      highlightedIndex,
      isOpen,
      ...props
    }: AssetSearchResultsProps,
    ref
  ) => {
    if (!assets) return null;

    return (
      <Fade in={isOpen && !!assets?.length}>
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
            {assets?.map((asset, index) => {
              const isStx = asset.type === 'stx';
              if (isStx && !hasStxBalance) return null;
              return (
                <AssetRow
                  isPressable
                  asset={asset}
                  index={index}
                  key={`${asset.contractAddress || asset.name}__${index}`}
                  data-asset={isStx ? 'stx' : asset.meta?.symbol}
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
