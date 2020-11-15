import React from 'react';
import { Flex, Text, Box, BoxProps, color } from '@stacks/ui';
import type { AddressBalanceResponse } from '@blockstack/stacks-blockchain-api-types';
import { stacksValue } from '@common/stacks-utils';
import { AssetRow } from './asset-row';

const NoTokens: React.FC<BoxProps> = props => (
  <Box width="100%" py="extra-loose" textAlign="center" {...props}>
    <Text color={color('text-caption')} fontSize={1} display="block" mb="extra-tight">
      You don't own any tokens.
    </Text>
    <Text
      as="a"
      href="https://binance.com"
      target="_blank"
      rel="noreferrer noopener"
      color={color('accent')}
      fontSize={1}
    >
      Buy Stacks Token
    </Text>
  </Box>
);

interface TokenAssetProps extends BoxProps {
  balances: AddressBalanceResponse;
}
export const TokenAssets: React.FC<TokenAssetProps> = ({ balances, ...props }) => {
  const noTokens =
    balances.stx.balance === '0' && Object.keys(balances.fungible_tokens).length === 0;
  if (noTokens) {
    return <NoTokens {...props} />;
  }

  const fungibleTokens = Object.keys(balances.fungible_tokens).map(key => {
    const token = balances.fungible_tokens[key];
    const friendlyName = key.split('::')[1];
    return (
      <AssetRow
        name={key}
        friendlyName={friendlyName}
        key={key}
        value={token.balance}
        subtitle={friendlyName.slice(0, 3).toUpperCase()}
      />
    );
  });
  return (
    <Box width="100%" py="base" {...props}>
      <Flex flexWrap="wrap" flexDirection="column">
        <AssetRow
          name="STX"
          friendlyName="Stacks Token"
          value={stacksValue({ value: balances.stx.balance, withTicker: false })}
          subtitle="STX"
        />
        {fungibleTokens}
      </Flex>
    </Box>
  );
};
