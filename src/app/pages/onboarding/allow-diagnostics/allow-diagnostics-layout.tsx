import { OnboardingSelectors } from '@tests/selectors/onboarding.selectors';
import { Box, Flex, Stack, styled } from 'leather-styles/jsx';

import { Button } from '@app/ui/components/button/button';
import { Dialog } from '@app/ui/components/containers/dialog/dialog';
import { Footer } from '@app/ui/components/containers/footers/footer';
import { CheckmarkIcon } from '@app/ui/icons/';
import { LogomarkIcon } from '@app/ui/icons/logomark-icon';

interface ReasonToAllowDiagnosticsProps {
  text: string;
}
function ReasonToAllowDiagnostics({ text }: ReasonToAllowDiagnosticsProps) {
  return (
    <Flex textStyle="body.02">
      <Box mr="space.02" mt="3px">
        <CheckmarkIcon />
      </Box>
      <Box>{text}</Box>
    </Flex>
  );
}

interface AllowDiagnosticsLayoutProps {
  onUserAllowDiagnostics(): void;
  onUserDenyDiagnostics(): void;
}
export function AllowDiagnosticsLayout({
  onUserAllowDiagnostics,
  onUserDenyDiagnostics,
}: AllowDiagnosticsLayoutProps) {
  return (
    <Dialog
      onClose={() => null}
      isShowing
      footer={
        <Footer>
          <Flex flexDirection="row" gap="space.04">
            <Button
              flexGrow={1}
              variant="outline"
              onClick={() => onUserDenyDiagnostics()}
              data-testid={OnboardingSelectors.DenyAnalyticsBtn}
            >
              Deny
            </Button>
            <Button
              flexGrow={1}
              autoFocus
              data-testid={OnboardingSelectors.AllowAnalyticsBtn}
              onClick={onUserAllowDiagnostics}
            >
              Allow
            </Button>
          </Flex>
        </Footer>
      }
    >
      <styled.header padding="space.04">
        <Box px="space.02">
          <LogomarkIcon />
        </Box>
      </styled.header>
      <Stack p="space.05" gap="space.05">
        <styled.h1 textStyle="heading.03">Help us improve</styled.h1>
        <styled.p textStyle="heading.05">
          Leather would like to gather deidentified service usage data to help improve the
          experience of the wallet.
        </styled.p>

        <Stack gap="space.04" textStyle="body.01">
          <ReasonToAllowDiagnostics text="Send data about page views, clicks, and errors" />
          <ReasonToAllowDiagnostics text="This data is tied to randomly-generated IDs, and not personal data such as your Stacks address, keys, balances or IP address" />
          <ReasonToAllowDiagnostics text="This data is used to generate and send crash reports, help fix errors, and analyze statistics" />
        </Stack>
      </Stack>
    </Dialog>
  );
}
