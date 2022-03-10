import { FiCheck } from 'react-icons/fi';
import { color, Box, Flex } from '@stacks/ui';

import { BaseDrawer } from '@app/components/drawer';
import { Caption } from '@app/components/typography';
import ConnectLedgerSuccess from '@assets/images/ledger/connect-ledger-success.png';

import { LedgerDrawerType, LedgerTitle } from '../components/ledger-title';

interface ConnectLedgerSuccessLayoutProps {
  onCloseModal(): void;
}
export function ConnectLedgerSuccessLayout(props: ConnectLedgerSuccessLayoutProps) {
  return (
    <BaseDrawer title={<Box />} onClose={props.onCloseModal} isShowing>
      <Flex alignItems="center" flexDirection="column" pb="loose" px="loose" textAlign="center">
        <Box mt="tight">
          <img src={ConnectLedgerSuccess} width="267px" />
        </Box>
        <LedgerTitle mb="base-tight" mt="41px" mx="50px" type={LedgerDrawerType.Connect} />
        <Flex alignItems="center" color={color('feedback-success')} flexDirection="row" my="base">
          <FiCheck />
          <Caption color="inherited" ml="tight">
            Connected!
          </Caption>
        </Flex>
      </Flex>
    </BaseDrawer>
  );
}
