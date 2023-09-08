import BroadcastError from '@assets/images/unhappy-face-ui.png';
import { Box, Flex } from 'leather-styles/jsx';

import { LeatherButton } from '@app/components/button/button';
import { Body } from '@app/components/typography';

import { LedgerTitle } from '../../components/ledger-title';
import { LedgerWrapper } from '../../components/ledger-wrapper';

interface LedgerBroadcastErrorLayoutProps {
  error: string;
  onClose(): void;
}
export function LedgerBroadcastErrorLayout(props: LedgerBroadcastErrorLayoutProps) {
  const { error, onClose } = props;

  return (
    <LedgerWrapper>
      <Box mb="space.05" mt="space.02">
        <img src={BroadcastError} width="242px" />
      </Box>
      <LedgerTitle mb="space.05" mt="space.05" mx="40px">
        Transaction Broadcast Error
      </LedgerTitle>
      <Body mt="space.03" px="space.04">
        Your transaction failed to broadcast {error && <>because of the error: {error}</>}
      </Body>
      <Flex mt="base-loose">
        {/* // #4164 FIXME migrate tertiary */}
        <LeatherButton variant="ghost" mr="space.03" onClick={onClose}>
          Close
        </LeatherButton>
      </Flex>
    </LedgerWrapper>
  );
}
