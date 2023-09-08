import LedgerWithRedOutline from '@assets/images/ledger/ledger-red-outline.png';
import { Box, Flex, styled } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

import { LeatherButton } from '@app/components/button/button';
import { Title } from '@app/components/typography';

import { LedgerWrapper } from '../../components/ledger-wrapper';

interface LedgerDeviceInvalidPayloadLayoutProps {
  onClose(): void;
}
export function LedgerDeviceInvalidPayloadLayout({
  onClose,
}: LedgerDeviceInvalidPayloadLayoutProps) {
  return (
    <LedgerWrapper>
      <Box>
        <img src={LedgerWithRedOutline} width="247px" height="55px" />
      </Box>
      <Title mt="space.06">Data Invalid</Title>
      <styled.span mt="space.03" lineHeight="24px" color={token('colors.accent.text-subdued')}>
        Your Ledger device has rejected the payload stating it is invalid
      </styled.span>
      <Flex mt="base-loose">
        <LeatherButton variant="ghost" mr="space.03" onClick={onClose}>
          Close
        </LeatherButton>
      </Flex>
    </LedgerWrapper>
  );
}
