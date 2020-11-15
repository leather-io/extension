import React from 'react';
import { Box, Flex, Button, Text } from '@blockstack/ui';
import { BaseDrawer, BaseDrawerProps } from './index';

const Divider: React.FC = () => <Box height="1px" backgroundColor="ink.200" my="base" />;

interface ConfirmSendDrawerProps extends BaseDrawerProps {
  amount: number;
  recipient: string;
}

export const ConfirmSendDrawer: React.FC<ConfirmSendDrawerProps> = ({
  showing,
  close,
  amount,
  recipient,
}) => {
  return (
    <BaseDrawer showing={showing} close={close}>
      <Box width="100%" px={6}>
        <Text fontSize={4} fontWeight="600">
          Confirm transfer
        </Text>
      </Box>
      <Box width="100%" px={6}>
        <Divider />
        <Text fontSize={2} fontWeight="500" display="block" mb="extra-tight">
          Amount
        </Text>
        <Text fontSize={2}>{amount}</Text>
      </Box>
      <Box width="100%" px={6}>
        <Divider />
        <Text fontSize={2} fontWeight="500" display="block" mb="extra-tight">
          To
        </Text>
        <Text fontSize={2}>{recipient}</Text>
      </Box>
      <Flex width="100%" px="6" flexGrow={1}>
        <Button width="50%" mode="secondary" mr={2} onClick={close}>
          Cancel
        </Button>
        <Button width="50%" mode="primary" ml={2}>
          Send
        </Button>
      </Flex>
    </BaseDrawer>
  );
};
