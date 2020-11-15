import React from 'react';
import { Text, Box, BoxProps, color, Flex } from '@stacks/ui';
import { AddressBalanceResponse } from '@blockstack/stacks-blockchain-api-types';
import { AssetRow } from './asset-row';

const NoCollectibles: React.FC<BoxProps> = props => (
  <Box width="100%" py="extra-loose" textAlign="center" {...props}>
    <Text color={color('text-caption')} fontSize={1} display="block" mb="extra-tight">
      You don't own any collectibles.
    </Text>
  </Box>
);

interface CollectibleAssetProps extends BoxProps {
  balances: AddressBalanceResponse;
}
export const CollectibleAssets: React.FC<CollectibleAssetProps> = ({ balances, ...props }) => {
  const noCollectibles = Object.keys(balances.non_fungible_tokens).length === 0;
  if (noCollectibles) {
    return <NoCollectibles {...props} />;
  }

  const collectibles = Object.keys(balances.non_fungible_tokens).map(key => {
    const collectible = balances.non_fungible_tokens[key];
    const friendlyName = key.split('::')[1];
    return (
      <AssetRow
        name={key}
        friendlyName={friendlyName}
        key={key}
        value={collectible.count}
        subtitle={friendlyName.slice(0, 3).toUpperCase()}
      />
    );
  });
  return (
    <Box width="100%" py="base" {...props}>
      <Flex flexWrap="wrap" flexDirection="column">
        {collectibles}
      </Flex>
    </Box>
  );
};
