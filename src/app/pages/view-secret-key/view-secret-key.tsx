import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Stack, styled } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

import { RouteUrls } from '@shared/route-urls';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { LeatherButton } from '@app/components/button/button';
import { CenteredPageContainer } from '@app/components/centered-page-container';
import { Header } from '@app/components/header';
import { RequestPassword } from '@app/components/request-password';
import { SecretKeyDisplayer } from '@app/features/secret-key-displayer/secret-key-displayer';
import { useDefaultWalletSecretKey } from '@app/store/in-memory-key/in-memory-key.selectors';

export function ViewSecretKey() {
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
        maxWidth={token('sizes.centredPageFullWidth')}
        pb={['space.05', 'unset']}
        px={['space.05', 'base-loose']}
        gap="space.05" // TODO - make sure spacing maps to gap
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
            <styled.h1 textStyle="heading.02">Your Secret Key</styled.h1>
            <styled.span textStyle="body.02">
              These 24 words are your Secret Key. They create your account, and you sign in on
              different devices with them. Make sure to save these somewhere safe.
            </styled.span>

            <styled.span textStyle="body.02">
              If you lose these words, you lose your account.
            </styled.span>

            <SecretKeyDisplayer secretKey={defaultWalletSecretKey ?? ''} />
            <LeatherButton onClick={() => navigate(RouteUrls.Home)}>I've saved it</LeatherButton>
          </>
        )}
      </Stack>
    </CenteredPageContainer>
  );
}
