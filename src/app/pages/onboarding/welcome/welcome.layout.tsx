import { Outlet } from 'react-router-dom';
import { Box, color, Flex, Stack } from '@stacks/ui';

import { isFullPage } from '@app/common/utils';
import { Caption, Text } from '@app/components/typography';
import { Link } from '@app/components/link';
import { PageTitle } from '@app/components/page-title';
import { PrimaryButton } from '@app/components/primary-button';
import { CenteredPageContainer } from '@app/components/centered-page-container';
import ExploreStacks from '@assets/images/onboarding/explore-stacks.svg';
import { OnboardingSelectors } from '@tests/integration/onboarding.selectors';

const WelcomeIllustration = () =>
  isFullPage ? (
    <Box bg={color('border')} borderRadius="16px" height="675px" width="518px">
      <Box left="43px" position="relative" top="92px">
        <img src={ExploreStacks} width="432px" />
      </Box>
    </Box>
  ) : (
    <Box bg={color('border')} borderRadius="16px" height="155px" overflow="hidden" width="344px">
      <Box position="relative" top="-138px">
        <img src={ExploreStacks} width="346px" />
      </Box>
    </Box>
  );

interface WelcomeLayoutProps {
  isGeneratingWallet: boolean;
  onSelectConnectLedger(): void;
  onStartOnboarding(): void;
  onSelectConnectLedger(): void;
  onRestoreWallet(): void;
}
export function WelcomeLayout(props: WelcomeLayoutProps): JSX.Element {
  const { isGeneratingWallet, onStartOnboarding, onSelectConnectLedger, onRestoreWallet } = props;

  return (
    <CenteredPageContainer>
      <Stack isInline={isFullPage} width="100%">
        <Flex flexGrow={1} justifyContent="center" order={[0, 1, 1]}>
          <WelcomeIllustration />
        </Flex>
        <Flex alignItems="center" flexGrow={1} justifyContent="center" mt={['base', 'unset']}>
          <Stack maxWidth="500px" spacing={['base', 'base-loose', 'loose']}>
            <PageTitle isHeadline>Explore the world of Stacks</PageTitle>
            <Text pr={['unset', '60px']}>
              Hiro Wallet connects you to Stacks apps while keeping your account, data, and crypto
              secure. Create your Stacks account to get started.
            </Text>
            <PrimaryButton
              data-testid={OnboardingSelectors.SignUpBtn}
              isLoading={isGeneratingWallet}
              onClick={onStartOnboarding}
              width="198px"
            >
              Create Stacks Account
            </PrimaryButton>
            <Flex flexDirection="column" mt={['base', 'base-tight', 'tight']} fontSize="14px">
              <Caption>Already have a Stacks account?</Caption>
              <Box mt="tight">
                <Link
                  fontSize="inherit"
                  data-testid={OnboardingSelectors.SignInLink}
                  onClick={onRestoreWallet}
                >
                  Sign in with Secret Key
                </Link>{' '}
                or{' '}
                <Link fontSize="inherit" onClick={onSelectConnectLedger}>
                  connect your Ledger
                </Link>
              </Box>
            </Flex>
          </Stack>
        </Flex>
      </Stack>
      <Outlet />
    </CenteredPageContainer>
  );
}
