import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

import { analytics } from '@shared/utils/analytics';

import { Content, TwoColumnLayout } from '@app/components/layout';
import { RequestPassword } from '@app/components/request-password';
import { OnboardingHeader } from '@app/features/container/headers/onboarding.header';
import { SecretKey } from '@app/features/secret-key-displayer/secret-key-displayer';
import { useDefaultWalletSecretKey } from '@app/store/in-memory-key/in-memory-key.selectors';

export function ViewSecretKey() {
  const defaultWalletSecretKey = useDefaultWalletSecretKey();
  const [showSecretKey, setShowSecretKey] = useState(false);

  useEffect(() => {
    void analytics.page('view', '/save-secret-key');
  }, []);

  if (showSecretKey) {
    return (
      <>
        <OnboardingHeader />
        <Content>
          <TwoColumnLayout
            title={
              <>
                Your <br /> Secret Key
              </>
            }
            content={
              <>
                These 24 words are your Secret Key. They create your account, and you sign in on
                different devices with them. Make sure to save these somewhere safe.
                <br />
                If you lose these words, you lose your account.
              </>
            }
          >
            <SecretKey secretKey={defaultWalletSecretKey ?? ''} />
          </TwoColumnLayout>
        </Content>
      </>
    );
  }

  return (
    <>
      <OnboardingHeader hideLogo />
      <Content>
        <RequestPassword onSuccess={() => setShowSecretKey(true)} />
        <Outlet />
      </Content>
    </>
  );
}
