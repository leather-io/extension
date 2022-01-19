import { cx } from '@emotion/css';
import { Flex, Stack } from '@stacks/ui';

import { isFullPage, isPopup } from '@app/common/utils';
import { Text, Title } from '@app/components/typography';
import { Link } from '@app/components/link';
import { PrimaryButton } from '@app/components/primary-button';
import { CenteredPageContainer } from '@app/components/centered-page-container';
import WelcomeStacksFull from '@assets/images/onboarding/welcome-full.svg';
import WelcomeStacksPopup from '@assets/images/onboarding/welcome-popup.svg';
import {
  fullPageOnboardingContent,
  fullPageOnboardingTitle,
  popupPageContent,
  popupPageTitle,
} from '@app/pages/pages.styles';
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
    <CenteredPageContainer>
      <Stack isInline={isFullPage} width="100%">
        <Flex flexGrow={1} justifyContent="center" order={isFullPage ? 1 : 0}>
          <WelcomeIllustration />
        </Flex>
        <Flex
          className={cx(
            { [fullPageOnboardingContent]: isFullPage },
            { [popupPageContent]: isPopup }
          )}
          flexGrow={1}
          justifyContent="center"
        >
          <Stack maxWidth="500px" spacing="loose">
            <Title
              className={cx(
                { [fullPageOnboardingTitle]: isFullPage },
                { [popupPageTitle]: isPopup }
              )}
              fontWeight={500}
            >
              Explore the world of Stacks
            </Title>
            <Text>
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
            <Link
              data-testid={OnboardingSelectors.SignInLink}
              fontSize="14px"
              onClick={onRestoreWallet}
            >
              I already have an account
            </Link>
          </Stack>
        </Flex>
      </Stack>
    </CenteredPageContainer>
  );
}
