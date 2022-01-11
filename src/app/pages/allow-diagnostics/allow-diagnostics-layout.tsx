import { FC } from 'react';

import { Body, Title } from '@app/components/typography';
import { Box, Button, Flex, color, Stack } from '@stacks/ui';
import { FiCheck } from 'react-icons/fi';
import { InitialPageSelectors } from '@tests/integration/initial-page.selectors';

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
export function AllowDiagnosticsLayout(props: AllowDiagnosticsLayoutProps) {
  const { onUserAllowDiagnostics, onUserDenyDiagnosticsPermissions } = props;

  return (
    <Stack spacing="extra-loose" flexGrow={1} justifyContent="center">
      <Title as="h1" fontWeight={500} textAlign="center">
        Help us improve
      </Title>
      <Box mx="loose" mb="extra-loose">
        <Body>
          We would like to gather de-identified usage data to help improve your experience with Hiro
          Wallet.
        </Body>
        <Stack mt="loose" spacing="base-tight">
          <ReasonToAllowDiagnostics text="Send anonymous data about page views and clicks" />
          <ReasonToAllowDiagnostics text="This data is tied to randomly-generated IDs and not personal data, such as your Stacks addresses, keys, balance, or IP addresses" />
          <ReasonToAllowDiagnostics text="This data is used to generate and send crash reports, help us fix errors, and analyze trends and statistics" />
        </Stack>
        <Flex mt="loose" fontSize="14px" justifyContent="center">
          <Button
            type="button"
            size="lg"
            mode="primary"
            data-testid={InitialPageSelectors.AnalyticsAllow}
            onClick={() => onUserAllowDiagnostics()}
            mr="base-tight"
          >
            Allow
          </Button>
          <Button
            type="button"
            mode="tertiary"
            size="lg"
            ml="base"
            variant="link"
            onClick={() => onUserDenyDiagnosticsPermissions()}
          >
            Deny
          </Button>
        </Flex>
      </Box>
    </Stack>
  );
}
