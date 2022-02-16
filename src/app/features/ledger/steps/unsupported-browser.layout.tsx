import { Box, Flex, Text } from '@stacks/ui';

import UnsupportedBrowserImg from '@assets/images/ledger/unsupported-browser.png';

import { ExternalLink } from '@app/components/external-link';
import { LedgerTitle } from '../components/ledger-title';

export function UnsupportedBrowserLayout() {
  return (
    <Flex alignItems="center" flexDirection="column" pb="loose" px="loose" textAlign="center">
      <Box mb="loose" mt="tight">
        <img src={UnsupportedBrowserImg} width="239px" height="177px" />
      </Box>
      <LedgerTitle mt="tight">Your browser isn't supported</LedgerTitle>
      <Text
        as="p"
        fontSize="16px"
        lineHeight="1.7"
        mt="base"
        pb="base-tight"
        mx="extra-loose"
        color="#74777D"
      >
        To connect your Ledger with the Hiro Wallet try{' '}
        <ExternalLink href="https://www.google.com/chrome/">Chrome</ExternalLink> or{' '}
        <ExternalLink href="https://brave.com/download/">Brave</ExternalLink>.
      </Text>
    </Flex>
  );
}
