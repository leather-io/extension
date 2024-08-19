import { OnboardingSelectors } from '@tests/selectors/onboarding.selectors';
import { Box, Flex, styled } from 'leather-styles/jsx';

import { Button, LeatherLettermarkIcon, LeatherLogomarkIcon, Link } from '@leather.io/ui';

import { useThemeSwitcher } from '@app/common/theme-provider';

interface WelcomeLayoutProps {
  isGeneratingWallet: boolean;
  onSelectConnectLedger(): void;
  onStartOnboarding(): void;
  onRestoreWallet(): void;
}
export function WelcomeLayout({
  isGeneratingWallet,
  onStartOnboarding,
  onSelectConnectLedger,
  onRestoreWallet,
}: WelcomeLayoutProps): React.JSX.Element {
  // On this page 'theme' is used to set specific colours and bypass automatic theming
  const { theme } = useThemeSwitcher();
  // hardcoded specific instances of colour variables needed to bypass theme
  const inkBgSecondary = '#F5F1ED';
  const inkTextPrimary = '#12100F';

  const primaryActionButton = {
    p: 'space.03',
    minWidth: '148px',
    bg: {
      base: inkBgSecondary,
      md: theme === 'light' ? inkBgSecondary : inkTextPrimary,
    },
    color: {
      base: inkTextPrimary,
      md: theme === 'light' ? inkTextPrimary : inkBgSecondary,
    },

    _hover: {
      bg: 'ink.action-primary-hover',
      color: theme === 'light' ? inkBgSecondary : inkTextPrimary,
    },
  };
  const secondaryActionButton = {
    p: 'space.03',
    minWidth: '148px',
    color: { base: inkBgSecondary, md: theme === 'light' ? inkBgSecondary : inkTextPrimary },
    border: `1px solid ${inkBgSecondary}`,
    borderColor: { base: inkBgSecondary, md: theme === 'light' ? inkBgSecondary : inkTextPrimary },
    _hover: {
      bg: 'ink.action-primary-hover',
      color: 'ink.background-secondary',
    },
  };

  const tagline = 'Bitcoin for the rest of us';
  const taglineExtended = 'The bitcoin wallet for the rest of us';
  const subheader =
    'Leather is the only Bitcoin wallet you need to tap into the emerging Bitcoin economy';

  return (
    <Flex flexDir={{ base: 'column-reverse', md: 'row' }} minW="100vw" minH="100vh">
      <Flex
        flexDir="column"
        bg={{ base: inkTextPrimary, md: 'ink.text-primary' }}
        flex={{ base: 1, md: 2 }}
        p="space.05"
      >
        <Flex
          flexDir="column"
          flex={{ base: 1, md: 0 }}
          justifyContent={{ base: 'end', md: 'flex-start' }}
          color={{ base: inkBgSecondary, md: 'ink.background-primary' }}
        >
          <styled.h1 hideBelow="md" textStyle="display.01" maxWidth="880px">
            {tagline}
          </styled.h1>
          <styled.h1 hideFrom="md" textStyle="heading.03" maxWidth="880px">
            {taglineExtended}
          </styled.h1>

          <styled.h2
            textStyle={{ base: 'label.01', md: 'heading.04' }}
            mt={{ base: 'space.02', md: 'space.07' }}
            maxW="556px"
          >
            {subheader}
          </styled.h2>
        </Flex>
        <Flex flexDir={{ base: 'column', md: 'row' }} gap="space.04" mt="space.07" width="100%">
          <Button
            onClick={onStartOnboarding}
            data-testid={OnboardingSelectors.SignUpBtn}
            aria-busy={isGeneratingWallet}
            css={primaryActionButton}
          >
            Create new wallet
          </Button>

          <Flex gap="space.04">
            <Button
              variant="outline"
              flex={1}
              onClick={onRestoreWallet}
              css={secondaryActionButton}
              data-testid={OnboardingSelectors.SignInLink}
              fullWidth
            >
              Use existing key
            </Button>
            <Button
              variant="outline"
              flex={1}
              onClick={onSelectConnectLedger}
              css={secondaryActionButton}
              fullWidth
            >
              Use Ledger
            </Button>
          </Flex>
        </Flex>
      </Flex>
      <Flex
        p="space.05"
        bg={{ base: inkTextPrimary, md: 'ink.background-secondary' }}
        color={{ base: inkBgSecondary, md: 'ink.text-primary' }}
        flexDir="column"
        justifyContent="space-between"
        flex={{ base: 0, md: 1 }}
      >
        <Flex justifyContent="space-between">
          <LeatherLogomarkIcon height={34} width={150} />
          <Link href="https://leather.io/" hideBelow="md" variant="text">
            leather.io
          </Link>
        </Flex>
        <Box hideBelow="md">
          <LeatherLettermarkIcon height="auto" width="100%" />
        </Box>
      </Flex>
    </Flex>
  );
}
