import LedgerWithRedOutline from '@assets/images/ledger/ledger-red-outline.png';
import { Box, Flex, styled } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

import { LeatherButton } from '@app/components/button/button';
import { Title } from '@app/components/typography';

import { LedgerWrapper } from '../../components/ledger-wrapper';

interface PublicKeyMismatchLayoutProps {
  onClose(): void;
  onTryAgain(): void;
}
export function PublicKeyMismatchLayout({ onClose, onTryAgain }: PublicKeyMismatchLayoutProps) {
  return (
    <LedgerWrapper>
      <Box>
        <img src={LedgerWithRedOutline} width="247px" height="55px" />
      </Box>
      <Title mt="space.06">Public key does not match</Title>
      <styled.span mt="space.03" lineHeight="24px" color={token('colors.accent.text-subdued')}>
        Ensure you're using the same Ledger you used when setting up the Leather
      </styled.span>
      <Flex mt="base-loose">
        {/* // #4164 FIXME migrate check this variant is OK */}
        <LeatherButton variant="ghost" mr="space.03" onClick={onClose}>
          Close
        </LeatherButton>
        <LeatherButton onClick={onTryAgain}>Try again</LeatherButton>
      </Flex>
    </LedgerWrapper>
  );
}
