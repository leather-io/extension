import { Outlet } from 'react-router-dom';

import ExploreStacks from '@assets/images/onboarding/explore-stacks.png';
import { Box, Flex, color } from '@stacks/ui';
import { OnboardingSelectors } from '@tests/selectors/onboarding.selectors';

import { CenteredPageContainer } from '@app/components/centered-page-container';
import { ONBOARDING_PAGE_MAX_WIDTH } from '@app/components/global-styles/full-page-styles';
import { Link } from '@app/components/link';
import { PageTitle } from '@app/components/page-title';
import { PrimaryButton } from '@app/components/primary-button';
import { Caption, Text } from '@app/components/typography';

function WelcomeIllustration() {
  return (
    <Box
      aria-label="Abstract illustration highlighting crypto symbology"
      backgroundColor={color('border')}
      backgroundImage={`url(${ExploreStacks})`}
      backgroundPosition={[null, null, 'center']}
      backgroundPositionY={['-137px', '-187px', 'center']}
      backgroundRepeat="no-repeat"
      backgroundSize={['cover', null, null, '80%']}
      borderRadius="16px"
      height={['155px', '220px', '675px']}
      maxHeight="675px"
      maxWidth={['auto', 'auto', '518px']}
      overflow="hidden"
      width="100%"
    />
  );
}

interface WelcomeLayoutProps {
  isGeneratingWallet: boolean;
  onSelectConnectLedger(): void;
  onStartOnboarding(): void;
  onRestoreWallet(): void;
}
export function WelcomeLayout(props: WelcomeLayoutProps): React.JSX.Element {
  const { isGeneratingWallet, onStartOnboarding, onSelectConnectLedger, onRestoreWallet } = props;

  return (
    <CenteredPageContainer>
      <Flex
        justifyContent="start"
        flexDirection={['column', 'column', 'row-reverse']}
        maxWidth={ONBOARDING_PAGE_MAX_WIDTH}
        mt="tight"
        px="loose"
        width="100%"
      >
        <Flex flexGrow={1} justifyContent={['left', 'left', 'right']}>
          <WelcomeIllustration />
        </Flex>
        <Flex
          alignItems="left"
          flexDirection="column"
          flexGrow="2"
          justifyContent="center"
          maxWidth="574px"
          mt={['base', 'unset']}
        >
          <PageTitle isHeadline maxWidth={['75%', '85%', '90%']} mt={['tight', 'base', 'loose']}>
            Your gateway to Web3 on Bitcoin
          </PageTitle>
          <Text
            maxWidth={['unset', '90%']}
            mt={['base', null, null, 'extra-loose']}
            pr={['unset', '80px']}
          >
            Connect to apps and manage your assets secured by Bitcoin with the most popular wallet
            for the Stacks blockchain
          </Text>
          <Box>
            <PrimaryButton
              data-testid={OnboardingSelectors.SignUpBtn}
              isLoading={isGeneratingWallet}
              mt={['base', null, 'loose']}
              onClick={onStartOnboarding}
            >
              Create new wallet
            </PrimaryButton>
          </Box>

          <Flex flexDirection="column" mt={['base', 'base-loose', 'extra-loose']} fontSize="14px">
            <Caption>Already have a wallet?</Caption>
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
        </Flex>
      </Flex>
      <Outlet />
    </CenteredPageContainer>
  );
}
