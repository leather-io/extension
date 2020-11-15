import React from 'react';
import { Text, Box, BoxProps } from '@blockstack/ui';

export const CollectibleAssets: React.FC<BoxProps> = props => {
  return (
    <Box width="100%" textAlign="center" py="extra-loose" {...props}>
      <Text color="gray" fontSize={1} display="block" mb="extra-tight">
        You don't own any collectibles.
      </Text>
    </Box>
  );
};
