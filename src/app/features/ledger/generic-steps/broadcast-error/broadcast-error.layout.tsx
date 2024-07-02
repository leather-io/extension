import BroadcastError from '@assets/images/unhappy-face-ui.png';
import { Box, Flex, styled } from 'leather-styles/jsx';

import { Button } from '@leather.io/ui';

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
      <LedgerTitle mb="space.05" mt="space.05" mx="space.07">
        Transaction Broadcast Error
      </LedgerTitle>
      <styled.span mt="space.03" px="space.04" textStyle="body.02">
        Your transaction failed to broadcast {error && <>because of the error: {error}</>}
      </styled.span>
      <Flex mt="space.04">
        <Button mr="space.03" onClick={onClose} variant="outline">
          Close
        </Button>
      </Flex>
    </LedgerWrapper>
  );
}
