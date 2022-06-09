import { memo } from 'react';
import { Box, Flex } from '@stacks/ui';
import { Body, Title } from '@app/components/typography';

export const AccountListUnavailable = memo(() => (
  <Flex
    flexDirection="column"
    justifyContent="center"
    px="loose"
    minHeight="120px"
    mb="extra-loose"
  >
    <Box>
      <Title>Unable to load account information</Title>
      <Body mt="base-tight">
        We're unable to load information about your accounts. This may be a problem with the
        wallet's API. If this problem persists, contact support.
      </Body>
    </Box>
  </Flex>
));
