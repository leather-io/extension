import UnsupportedBrowserImg from '@assets/images/ledger/unsupported-browser.png';
import { Box, Flex, styled } from 'leather-styles/jsx';

import { figmaTheme } from '@app/common/utils/figma-theme';
import { ExternalLink } from '@app/components/external-link';

import { LedgerTitle } from '../../components/ledger-title';

export function UnsupportedBrowserLayout() {
  return (
    <Flex alignItems="center" flexDirection="column" pb="space.05" px="space.05" textAlign="center">
      <Box mb="space.05" mt="space.02">
        <img src={UnsupportedBrowserImg} width="239px" height="177px" />
      </Box>
      <LedgerTitle mt="space.02">Your browser isn't supported</LedgerTitle>
      <styled.p
        fontSize="16px"
        lineHeight="1.7"
        mt="space.04"
        pb="space.03"
        mx="space.06"
        color={figmaTheme.textSubdued}
      >
        To connect your Ledger with the Leather try{' '}
        <ExternalLink href="https://www.google.com/chrome/">Chrome</ExternalLink> or{' '}
        <ExternalLink href="https://brave.com/download/">Brave</ExternalLink>.
      </styled.p>
    </Flex>
  );
}
