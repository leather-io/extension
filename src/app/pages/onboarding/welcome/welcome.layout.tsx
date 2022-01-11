import { cx } from '@emotion/css';
import { Flex, Button, Stack } from '@stacks/ui';

import { Text, Title } from '@app/components/typography';
import { Link } from '@app/components/link';
import WelcomeStacksFull from '@assets/images/onboarding/welcome-full.svg';
import WelcomeStacksPopup from '@assets/images/onboarding/welcome-popup.svg';
import { isFullPage, isPopup } from '@app/common/utils';
import {
  fullPageOnboardingContent,
  fullPageOnboardingTitle,
  popupPageContent,
  popupPageTitle,
} from '@app/pages/pages.styles';
import { OnboardingSelectors } from '@tests/integration/onboarding.selectors';

interface WelcomeLayoutProps {
  isGeneratingWallet: boolean;
  onStartOnboarding(): void;
  onRestoreWallet(): void;
}
export function WelcomeLayout(props: WelcomeLayoutProps): JSX.Element {
  const { isGeneratingWallet, onStartOnboarding, onRestoreWallet } = props;

  return (
    <Stack isInline={isFullPage} width="100%">
      <Flex flexGrow={1} justifyContent="center" order={isFullPage ? 1 : 0}>
        {isFullPage ? (
          <img src={WelcomeStacksFull} />
        ) : (
          <img src={WelcomeStacksPopup} width="394px" />
        )}
      </Flex>
      <Flex
        className={cx({ [fullPageOnboardingContent]: isFullPage }, { [popupPageContent]: isPopup })}
        flexGrow={1}
        justifyContent="center"
      >
        <Stack maxWidth="500px" spacing="loose">
          <Title
            className={cx({ [fullPageOnboardingTitle]: isFullPage }, { [popupPageTitle]: isPopup })}
            fontWeight={500}
          >
            Explore the world of Stacks
          </Title>
          <Text>
            Hiro Wallet connects you to Stacks apps while keeping your account, data, and crypto
            secure. Create your Stacks account to get started.
          </Text>
          <Button
            borderRadius="10px"
            data-testid={OnboardingSelectors.SignUpBtn}
            height="48px"
            isLoading={isGeneratingWallet}
            onClick={onStartOnboarding}
            width="198px"
          >
            Create Stacks Account
          </Button>
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
  );
}
