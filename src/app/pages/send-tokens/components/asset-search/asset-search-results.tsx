import { forwardRef } from 'react';

import { Fade, Stack, StackProps, color } from '@stacks/ui';

import type {
  StacksCryptoCurrencyAssetBalance,
  StacksFungibleTokenAssetBalance,
} from '@shared/models/crypto-asset-balance.model';

import { CryptoCurrencyAssetItem } from '@app/components/crypto-assets/crypto-currency-asset/crypto-currency-asset-item';
import { StxAvatar } from '@app/components/crypto-assets/stacks/components/stx-avatar';
import { StacksFungibleTokenAssetItem } from '@app/components/crypto-assets/stacks/fungible-token-asset/stacks-fungible-token-asset-item';

interface AssetSearchResultsProps extends StackProps {
  assetBalances: (StacksCryptoCurrencyAssetBalance | StacksFungibleTokenAssetBalance)[];
  getItemProps: any;
  hasStxBalance: boolean;
  highlightedIndex: number;
  isOpen: boolean;
}
export const AssetSearchResults = forwardRef(
  (
    {
      assetBalances,
      getItemProps,
      hasStxBalance,
      highlightedIndex,
      isOpen,
      ...props
    }: AssetSearchResultsProps,
    ref
  ) => {
    if (!assetBalances.length) return null;
    return (
      <Fade in={isOpen && !!assetBalances.length}>
        {styles => (
          <Stack
            flexDirection="column"
            boxShadow="0px 8px 16px rgba(27, 39, 51, 0.08);"
            borderRadius="6px"
            position="absolute"
            width="100%"
            top="77px"
            maxHeight="240px"
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
            {assetBalances.map((assetBalance, index) => {
              const isStx =
                assetBalance.blockchain === 'stacks' && assetBalance.type === 'crypto-currency';
              if (isStx && !hasStxBalance) return null;
              if (isStx)
                return (
                  <CryptoCurrencyAssetItem
                    assetBalance={assetBalance}
                    data-testid={assetBalance.asset.symbol}
                    highlighted={highlightedIndex === index ? 'ink.150' : 'white'}
                    icon={<StxAvatar />}
                    index={index}
                    isPressable
                    key={`${assetBalance.asset.name}__${index}`}
                    {...getItemProps({ item: assetBalance, index })}
                  />
                );
              return (
                <StacksFungibleTokenAssetItem
                  assetBalance={assetBalance}
                  data-testid={assetBalance.asset.symbol}
                  highlighted={highlightedIndex === index ? 'ink.150' : 'white'}
                  index={index}
                  isPressable
                  key={`${assetBalance.asset.name}__${index}`}
                  {...getItemProps({ item: assetBalance, index })}
                />
              );
            })}
          </Stack>
        )}
      </Fade>
    );
  }
);
