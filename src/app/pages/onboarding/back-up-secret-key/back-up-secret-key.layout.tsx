import BackUpSecretKey from '@assets/images/onboarding/back-up-secret-key.png';
import { Box, Flex, Stack, useMediaQuery } from '@stacks/ui';

import { CenteredPageContainer } from '@app/components/centered-page-container';
import {
  CENTERED_FULL_PAGE_MAX_WIDTH,
  DESKTOP_VIEWPORT_MIN_WIDTH,
  ONBOARDING_PAGE_MAX_WIDTH,
} from '@app/components/global-styles/full-page-styles';
import { PageTitle } from '@app/components/page-title';
import { Text } from '@app/components/typography';

import { BackUpSecretKeyActions } from './components/back-up-secret-key-actions';

interface BackUpSecretKeyLayoutProps {
  secretKeyDisplay: React.JSX.Element;
  onBackedUpSecretKey(): void;
}
export function BackUpSecretKeyLayout(props: BackUpSecretKeyLayoutProps): React.JSX.Element {
  const { secretKeyDisplay, onBackedUpSecretKey } = props;

  const [desktopViewport] = useMediaQuery(`(min-width: ${DESKTOP_VIEWPORT_MIN_WIDTH})`);

  return (
    <CenteredPageContainer>
      <Flex
        justifyContent="start"
        flexDirection={['column', 'column', 'unset']}
        maxWidth={ONBOARDING_PAGE_MAX_WIDTH}
        mt="tight"
        pb="loose"
        px="loose"
        width="100%"
      >
        <Flex
          alignItems={['start', 'center']}
          flexGrow={1}
          justifyContent="center"
          mt={['base', 'unset']}
        >
          <Stack maxWidth={CENTERED_FULL_PAGE_MAX_WIDTH} spacing="loose">
            <Box width={['142px', '183px']}>
              <img src={BackUpSecretKey} />
            </Box>
            <PageTitle>Back up your Secret Key</PageTitle>
            <Text maxWidth={['100%', '90%', '90%', '100%']}>
              Here’s your Secret Key: 24 words that generated your Stacks account. You’ll need it to
              access your account on a new device, in a different wallet, or in case you lose your
              password — so back it up somewhere safe.
            </Text>
            {desktopViewport && (
              <BackUpSecretKeyActions onBackedUpSecretKey={onBackedUpSecretKey} />
            )}
          </Stack>
        </Flex>
        <Flex
          alignItems={['start', 'center']}
          flexGrow={1}
          justifyContent="center"
          mt={['loose', 'loose', 'unset']}
        >
          <Box width={['344px', '446px']}>{secretKeyDisplay}</Box>
        </Flex>
        {!desktopViewport && (
          <Stack mt="loose" spacing="loose">
            <BackUpSecretKeyActions onBackedUpSecretKey={onBackedUpSecretKey} />
          </Stack>
        )}
      </Flex>
    </CenteredPageContainer>
  );
}
