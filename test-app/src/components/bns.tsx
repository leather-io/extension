import React from 'react';

import { Box, Button, Text } from '@stacks/ui';

export const Bns = () => {
  return (
    <Box py={6}>
      <Text as="h2" textStyle="display.small">
        BNS
      </Text>
      <Text textStyle="body.large" display="block" my={'loose'}>
        Use the testnet version of btc.us to QA BNS names.
      </Text>
      <Button onClick={() => window.open('https://btc-website.tintashlabs.com/')}>
        Open testnet btc.us
      </Button>
    </Box>
  );
};
