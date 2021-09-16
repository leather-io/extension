import React, { FC } from 'react';

import { Body } from '@components/typography';
import { Box, Button, Flex, color, Stack } from '@stacks/ui';
import { BaseDrawer } from '@components/drawer';
import { FiCheck } from 'react-icons/fi';

interface ReasonToAllowDiagnosticsProps {
  text: string;
}
const ReasonToAllowDiagnostics: FC<ReasonToAllowDiagnosticsProps> = ({ text }) => {
  return (
    <Flex color={color('text-caption')} textStyle="body.small">
      <Box mr="tight" mt="3px">
        <FiCheck />
      </Box>
      <Box>{text}</Box>
    </Flex>
  );
};

interface AllowDiagnosticsLayoutProps {
  onUserAllowDiagnostics(): void;
  onUserDenyDiagnosticsPermissions(): void;
}
export const AllowDiagnosticsLayout: FC<AllowDiagnosticsLayoutProps> = props => {
  const { onUserAllowDiagnostics, onUserDenyDiagnosticsPermissions } = props;

  const title = 'Help us improve';

  return (
    <BaseDrawer title={title} isShowing onClose={() => onUserDenyDiagnosticsPermissions()}>
      <Box mx="loose" mb="extra-loose">
        <Body>
          Hiro would like to gather anonymous data to help improve the experience of using Stacks
          apps and the wallet.
        </Body>
        <Stack mt="loose" spacing="base-tight">
          <ReasonToAllowDiagnostics text="Send anonymous data about page views and clicks" />
          <ReasonToAllowDiagnostics text="We'll never collect personal data such as your Stacks address, keys, balances, or IP address" />
          <ReasonToAllowDiagnostics text="We'll never share or sell any user data" />
        </Stack>
        <Flex mt="loose" fontSize="14px">
          <Button
            type="button"
            mode="primary"
            onClick={() => onUserAllowDiagnostics()}
            mr="base-tight"
          >
            Yes, I'll help
          </Button>
          <Button
            type="button"
            mode="tertiary"
            ml="base"
            variant="link"
            onClick={() => onUserDenyDiagnosticsPermissions()}
          >
            No thanks
          </Button>
        </Flex>
      </Box>
    </BaseDrawer>
  );
};
