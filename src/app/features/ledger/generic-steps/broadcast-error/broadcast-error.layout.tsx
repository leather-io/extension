import BroadcastError from '@assets/images/unhappy-face-ui.png';
import { Box, Button, Flex } from '@stacks/ui';

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
      <Box mb="loose" mt="tight">
        <img src={BroadcastError} width="242px" />
      </Box>
      <LedgerTitle mb="loose" mt="loose" mx="40px">
        Transaction Broadcast Error
      </LedgerTitle>
      <Body mt="base-tight" px="base">
        Your transaction failed to broadcast {error && <>because of the error: {error}</>}
      </Body>
      <Flex mt="base-loose">
        <Button mode="tertiary" mr="base-tight" onClick={onClose}>
          Close
        </Button>
      </Flex>
    </LedgerWrapper>
  );
}
