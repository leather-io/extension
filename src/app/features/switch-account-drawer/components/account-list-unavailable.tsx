import { memo } from 'react';

import { Box, Flex } from 'leather-styles/jsx';

import { Body, Title } from '@app/components/typography';

export const AccountListUnavailable = memo(() => (
  <Flex
    flexDirection="column"
    justifyContent="center"
    px="space.05"
    minHeight="120px"
    mb="space.06"
  >
    <Box>
      <Title>Unable to load account information</Title>
      <Body mt="space.03">
        We're unable to load information about your accounts. This may be a problem with the
        wallet's API. If this problem persists, contact support.
      </Body>
    </Box>
  </Flex>
));
