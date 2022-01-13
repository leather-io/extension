import { FC } from 'react';
import { FiCheck } from 'react-icons/fi';
import { Box, Button, Flex, color, Stack } from '@stacks/ui';

import { CenteredPageContainer } from '@app/components/centered-page-container';
import { PrimaryButton } from '@app/components/primary-button';
import { Text, Title } from '@app/components/typography';
import { CENTERED_FULL_PAGE_MAX_WIDTH } from '@app/components/global-styles/full-page-styles';
import HelpUsImprove from '@assets/images/onboarding/help-us-improve.png';
import { OnboardingSelectors } from '@tests/integration/onboarding/onboarding.selectors';

interface ReasonToAllowDiagnosticsProps {
  text: string;
}
const ReasonToAllowDiagnostics: FC<ReasonToAllowDiagnosticsProps> = ({ text }) => {
  return (
    <Flex color={color('text-caption')} textStyle={['body.small', 'body.large']}>
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
    <CenteredPageContainer>
      <Stack
        maxWidth={CENTERED_FULL_PAGE_MAX_WIDTH}
        mt={['loose', 'unset']}
        px={['loose', 'unset']}
        spacing="extra-loose"
        textAlign="left"
      >
        <Box width={['73px', '86px']}>
          <img src={HelpUsImprove} />
        </Box>
        <Title as="h1">Help us improve</Title>
        <Text pr={['unset', 'loose']}>
          Hiro would like to gather deidentified service usage data to help improve the experience
          of using Stacks apps and the wallet. {/* TODO: Need url for link here */}
          {/* <Link display="inline" fontSize="14px">
            Learn more
          </Link> */}
        </Text>
        <Stack pr={['unset', '40px']} spacing="base-tight">
          <ReasonToAllowDiagnostics text="Send data about page views, clicks, and errors" />
          <ReasonToAllowDiagnostics text="This data is tied to randomly-generated IDs, and not personal data such as your Stacks address, keys, balances or IP address" />
          <ReasonToAllowDiagnostics text="This data is used to generate and send crash reports, help fix errors, and analyze statistics" />
        </Stack>
        <Stack isInline>
          <PrimaryButton
            data-testid={OnboardingSelectors.AnalyticsAllowBtn}
            onClick={onUserAllowDiagnostics}
          >
            Allow
          </PrimaryButton>
          <Button
            fontSize="14px"
            mode="tertiary"
            ml="base"
            onClick={() => onUserDenyDiagnosticsPermissions()}
            type="button"
            variant="link"
            data-testid={OnboardingSelectors.AnalyticsDenyBtn}
          >
            Deny
          </Button>
        </Stack>
      </Stack>
    </CenteredPageContainer>
  );
}
