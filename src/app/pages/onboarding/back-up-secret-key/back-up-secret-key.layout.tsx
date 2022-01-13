import { Box, Flex, Stack } from '@stacks/ui';

import { Text } from '@app/components/typography';
import { isFullPage, isPopup } from '@app/common/utils';
import { CenteredPageContainer } from '@app/components/centered-page-container';
import { CENTERED_FULL_PAGE_MAX_WIDTH } from '@app/components/global-styles/full-page-styles';
import { PageTitle } from '@app/components/page-title';
import BackUpSecretKey from '@assets/images/onboarding/back-up-secret-key.png';

import { BackUpSecretKeyActions } from './components/back-up-secret-key-actions';

interface BackUpSecretKeyLayoutProps {
  secretKeyDisplay: JSX.Element;
  onBackedUpSecretKey(): void;
}
export function BackUpSecretKeyLayout(props: BackUpSecretKeyLayoutProps): JSX.Element {
  const { secretKeyDisplay, onBackedUpSecretKey } = props;

  return (
    <CenteredPageContainer>
      <Stack isInline={isFullPage} pb="loose" px={['loose', 'unset']} width="100%">
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
            <Text>
              Here’s your Secret Key: 24 words that generated your Stacks account. You’ll need it to
              access your account on a new device, in a different wallet, or in case you lose your
              password — so back it up somewhere safe.
            </Text>
            {isFullPage && <BackUpSecretKeyActions onBackedUpSecretKey={onBackedUpSecretKey} />}
          </Stack>
        </Flex>
        <Flex
          alignItems={['start', 'center']}
          flexGrow={1}
          justifyContent="center"
          mt={['base', 'unset']}
        >
          <Box width={['344px', '446px']}>{secretKeyDisplay}</Box>
        </Flex>
        {isPopup && (
          <Stack mt="loose" spacing="loose">
            <BackUpSecretKeyActions onBackedUpSecretKey={onBackedUpSecretKey} />
          </Stack>
        )}
      </Stack>
    </CenteredPageContainer>
  );
}
