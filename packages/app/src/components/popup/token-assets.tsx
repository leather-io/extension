import React from 'react';
import { Text, Box, BoxProps } from '@blockstack/ui';

export const TokenAssets: React.FC<BoxProps> = props => {
  return (
    <Box width="100%" textAlign="center" py="extra-loose" {...props}>
      <Text color="gray" fontSize={1} display="block" mb="extra-tight">
        You don't own any tokens.
      </Text>
      <Text color="blue" fontSize={1}>
        <a href="https://binance.com" target="_blank" rel="noreferrer noopener">
          Buy Stacks Token
        </a>
      </Text>
    </Box>
  );
};
