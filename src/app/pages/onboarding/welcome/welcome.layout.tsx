import { OnboardingSelectors } from '@tests/selectors/onboarding.selectors';
import { Box, Flex, styled } from 'leather-styles/jsx';

import { useViewportMinWidth } from '@app/common/hooks/use-media-query';
import { LeatherButton } from '@app/ui/components/button';
import { LeatherIcon } from '@app/ui/components/icons/leather-icon';
import { LeatherLettermarkIcon } from '@app/ui/components/icons/leather-lettermark-icon';

interface WelcomeLayoutProps {
  tagline: React.ReactNode;
  subheader: React.ReactNode;
  isGeneratingWallet: boolean;
  onSelectConnectLedger(): void;
  onStartOnboarding(): void;
  onRestoreWallet(): void;
}
export function WelcomeLayout(props: WelcomeLayoutProps): React.JSX.Element {
  const {
    tagline,
    subheader,
    isGeneratingWallet,
    onStartOnboarding,
    onSelectConnectLedger,
    onRestoreWallet,
  } = props;

  const isAtleastBreakpointMd = useViewportMinWidth('md');

  return (
    <Flex flexDir={['column-reverse', '', 'row']} minW="100vw" minH="100vh">
      <Flex flexDir="column" bg={['brown.2', '', 'brown.12']} flex={[1, 2]} p="space.05">
        <Flex
          flexDir="column"
          flex={[1, 1, 0]}
          justifyContent={['center', '', 'flex-start']}
          color={['brown.12', '', 'brown.2']}
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
          <LeatherButton
            invert={isAtleastBreakpointMd}
            mt={[0, 0, 'space.07']}
            onClick={onStartOnboarding}
            data-testid={OnboardingSelectors.SignUpBtn}
            aria-busy={isGeneratingWallet}
          >
            Create new wallet
          </LeatherButton>
          <Flex
            flexDir={['row', '', 'column']}
            gap="space.03"
            mt="space.04"
            alignItems="flex-start"
          >
            <LeatherButton
              variant={isAtleastBreakpointMd ? 'link' : 'outline'}
              invert={isAtleastBreakpointMd}
              flex={1}
              mt={[0, 0, 'space.05']}
              data-testid={OnboardingSelectors.SignInLink}
              onClick={onRestoreWallet}
            >
              Use existing key
            </LeatherButton>
            <LeatherButton
              variant={isAtleastBreakpointMd ? 'link' : 'outline'}
              invert={isAtleastBreakpointMd}
              flex={1}
              mt={[0, 0, 'space.05']}
              onClick={onSelectConnectLedger}
            >
              Use Ledger
            </LeatherButton>
          </Flex>
        </Flex>
      </Flex>
      <Flex
        p="space.05"
        bg="brown.2"
        color="brown.12"
        flexDir="column"
        justifyContent="space-between"
        flex={['', '', 1]}
      >
        <LeatherIcon width="150px" height="34px" />
        <LeatherLettermarkIcon display={['none', '', 'block']} width="100%" />
      </Flex>
    </Flex>
  );
}
