import React from 'react';
import { Text, Box, BoxProps, color } from '@stacks/ui';

export const TokenAssets: React.FC<BoxProps> = props => {
  return (
    <Box width="100%" textAlign="center" py="extra-loose" {...props}>
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
};
