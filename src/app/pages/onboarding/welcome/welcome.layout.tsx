import { Flex, Stack } from '@stacks/ui';

import { isFullPage } from '@app/common/utils';
import { Caption, Text } from '@app/components/typography';
import { Link } from '@app/components/link';
import { PageTitle } from '@app/components/page-title';
import { PrimaryButton } from '@app/components/primary-button';
import WelcomeStacksFull from '@assets/images/onboarding/welcome-full.svg';
import WelcomeStacksPopup from '@assets/images/onboarding/welcome-popup.svg';
import { OnboardingSelectors } from '@tests/integration/onboarding.selectors';

const WelcomeIllustration = () =>
  isFullPage ? <img src={WelcomeStacksFull} /> : <img src={WelcomeStacksPopup} width="394px" />;

interface WelcomeLayoutProps {
  isGeneratingWallet: boolean;
  onStartOnboarding(): void;
  onRestoreWallet(): void;
}
export function WelcomeLayout(props: WelcomeLayoutProps): JSX.Element {
  const { isGeneratingWallet, onStartOnboarding, onRestoreWallet } = props;

  return (
    <Stack isInline={isFullPage} width="100%">
      <Flex flexGrow={1} justifyContent="center" order={[0, 1, 1]}>
        <WelcomeIllustration />
      </Flex>
      <Flex alignItems="center" flexGrow={1} justifyContent="center" mt={['base', 'unset', null]}>
        <Stack maxWidth="500px" spacing={['base', 'base-loose', 'loose']}>
          <PageTitle isWelcomePage>Explore the world of Stacks</PageTitle>
          <Text pr={['unset', null, '60px']}>
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
          <Stack mt={['base', 'base-tight', 'tight']} spacing="tight">
            <Caption>Already have a Stacks account?</Caption>
            <Link
              data-testid={OnboardingSelectors.SignInLink}
              fontSize="14px"
              onClick={onRestoreWallet}
            >
              Sign in with Secret Key
            </Link>
          </Stack>
        </Stack>
      </Flex>
    </Stack>
  );
}
