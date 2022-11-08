import { memo, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Stack, color } from '@stacks/ui';

import { RouteUrls } from '@shared/route-urls';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { CenteredPageContainer } from '@app/components/centered-page-container';
import { CENTERED_FULL_PAGE_MAX_WIDTH } from '@app/components/global-styles/full-page-styles';
import { Header } from '@app/components/header';
import { PageTitle } from '@app/components/page-title';
import { PrimaryButton } from '@app/components/primary-button';
import { RequestPassword } from '@app/components/request-password';
import { Text } from '@app/components/typography';
import { SecretKeyDisplayer } from '@app/features/secret-key-displayer/secret-key-displayer';
import { useDefaultWalletSecretKey } from '@app/store/in-memory-key/in-memory-key.selectors';

export const ViewSecretKey = memo(() => {
  const analytics = useAnalytics();
  const navigate = useNavigate();
  const defaultWalletSecretKey = useDefaultWalletSecretKey();
  const [showSecretKey, setShowSecretKey] = useState(false);

  useRouteHeader(<Header onClose={() => navigate(RouteUrls.Home)} />);

  useEffect(() => {
    void analytics.page('view', '/save-secret-key');
  }, [analytics]);

  return (
    <CenteredPageContainer>
      <Stack
        maxWidth={CENTERED_FULL_PAGE_MAX_WIDTH}
        pb={['loose', 'unset']}
        px={['loose', 'base-loose']}
        spacing="loose"
        textAlign={['left', 'center']}
        width="100%"
      >
        {!showSecretKey ? (
          <RequestPassword
            title="View Secret Key"
            caption="Enter the password you set on this device"
            onSuccess={() => setShowSecretKey(true)}
          />
        ) : (
          <>
            <PageTitle fontSize={[4, 7]}>Your Secret Key</PageTitle>
            <Text color={color('text-caption')}>
              These 24 words are your Secret Key. They create your account, and you sign in on
              different devices with them. Make sure to save these somewhere safe.{' '}
              <Text display="inline" fontWeight={500}>
                If you lose these words, you lose your account.
              </Text>
            </Text>
            <SecretKeyDisplayer secretKey={defaultWalletSecretKey ?? ''} />
            <PrimaryButton onClick={() => navigate(RouteUrls.Home)}>I've saved it</PrimaryButton>
          </>
        )}
      </Stack>
    </CenteredPageContainer>
  );
});
