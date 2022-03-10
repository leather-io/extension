import { FiAlertCircle } from 'react-icons/fi';
import { Box, Button, color, Flex, Stack } from '@stacks/ui';

import { BaseDrawer } from '@app/components/drawer';
import { PrimaryButton } from '@app/components/primary-button';
import LedgerDisconnected from '@assets/images/ledger/ledger-disconnected.png';

import { LedgerDrawerType, LedgerTitle } from '../components/ledger-title';

interface LedgerDisconnectedLayoutProps {
  onCloseModal(): void;
}
export function LedgerDisconnectedLayout(props: LedgerDisconnectedLayoutProps) {
  return (
    <BaseDrawer title={<Box />} onClose={props.onCloseModal} isShowing>
      <Flex alignItems="center" flexDirection="column" pb="loose" px="loose" textAlign="center">
        <Box mb="loose" mt="tight">
          <img src={LedgerDisconnected} width="242px" />
        </Box>
        <FiAlertCircle color={color('feedback-error')} size="35px" />
        <LedgerTitle mb="loose" mt="loose" mx="40px" type={LedgerDrawerType.Disconnected} />
        <Stack isInline mb="loose">
          <Button
            _hover={{ boxShadow: 'none' }}
            borderRadius="10px"
            boxShadow="none"
            mode="tertiary"
            onClick={() => {}}
          >
            Close
          </Button>
          <PrimaryButton height="40px" onClick={() => {}}>
            Connect again
          </PrimaryButton>
        </Stack>
      </Flex>
    </BaseDrawer>
  );
}
