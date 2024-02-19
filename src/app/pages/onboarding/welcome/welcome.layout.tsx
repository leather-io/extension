import { OnboardingSelectors } from '@tests/selectors/onboarding.selectors';
import { Box, Flex, styled } from 'leather-styles/jsx';

import { useViewportMinWidth } from '@app/common/hooks/use-media-query';
import { Button } from '@app/ui/components/button/button';
import { Link } from '@app/ui/components/link/link';
import { LettermarkIcon } from '@app/ui/icons/lettermark-icon';
import { LogomarkIcon } from '@app/ui/icons/logomark-icon';

interface WelcomeLayoutProps {
  tagline: React.ReactNode;
  subheader: React.ReactNode;
  isGeneratingWallet: boolean;
  onSelectConnectLedger(): void;
  onStartOnboarding(): void;
  onRestoreWallet(): void;
}
export function WelcomeLayout({
  tagline,
  subheader,
  isGeneratingWallet,
  onStartOnboarding,
  onSelectConnectLedger,
  onRestoreWallet,
}: WelcomeLayoutProps): React.JSX.Element {
  const isAtleastBreakpointMd = useViewportMinWidth('md');

  return (
    <Flex flexDir={['column-reverse', '', 'row']} minW="100vw" minH="100vh">
      <Flex flexDir="column" bg={['ink.2', '', 'ink.12']} flex={[1, 2]} p="space.05">
        <Flex
          flexDir="column"
          flex={[1, 1, 0]}
          justifyContent={['center', '', 'flex-start']}
          color={['ink.12', '', 'ink.2']}
        >
          <Box>
            <styled.h1 textStyle={['heading.03', '', 'display.02', 'display.01']}>
              {tagline}
            </styled.h1>
            <styled.h2
              textStyle={['label.01', '', 'heading.04']}
              mt={['space.02', '', 'space.07']}
              maxW="556px"
            >
              {subheader}
            </styled.h2>
          </Box>
        </Flex>
        <Flex flexDir="column" alignItems={['normal', '', 'flex-start']}>
          <Button
            invert={isAtleastBreakpointMd}
            mt={[0, 0, 'space.07']}
            onClick={onStartOnboarding}
            data-testid={OnboardingSelectors.SignUpBtn}
            aria-busy={isGeneratingWallet}
          >
            Create new wallet
          </Button>
          <Flex
            flexDir={['row', '', 'column']}
            gap="space.03"
            mt="space.04"
            alignItems="flex-start"
          >
            <Link
              hideBelow="md"
              invert={isAtleastBreakpointMd}
              flex={1}
              mt={[0, 0, 'space.05']}
              data-testid={OnboardingSelectors.SignInLink}
              onClick={onRestoreWallet}
              size="lg"
            >
              Use existing key
            </Link>
            <Button
              hideFrom="md"
              variant="outline"
              invert={isAtleastBreakpointMd}
              flex={1}
              mt={[0, 0, 'space.05']}
              onClick={onRestoreWallet}
            >
              Use existing key
            </Button>
            <Link
              hideBelow="md"
              invert={isAtleastBreakpointMd}
              flex={1}
              mt={[0, 0, 'space.05']}
              onClick={onSelectConnectLedger}
              size="lg"
            >
              Use Ledger
            </Link>
            <Button
              hideFrom="md"
              variant="outline"
              invert={isAtleastBreakpointMd}
              flex={1}
              mt={[0, 0, 'space.05']}
              onClick={onSelectConnectLedger}
            >
              Use Ledger
            </Button>
          </Flex>
        </Flex>
      </Flex>
      <Flex
        p="space.05"
        bg="ink.2"
        color="ink.12"
        flexDir="column"
        justifyContent="space-between"
        flex={['', '', 1]}
      >
        <LogomarkIcon width="150px" height="34px" />
        <LettermarkIcon display={['none', '', 'block']} height="auto" width="100%" />
      </Flex>
    </Flex>
  );
}
