import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

import { TwoColumnLayout } from '@leather-wallet/ui';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { RequestPassword } from '@app/components/request-password';
import { SecretKey } from '@app/features/secret-key-displayer/secret-key-displayer';
import { useDefaultWalletSecretKey } from '@app/store/in-memory-key/in-memory-key.selectors';

export function ViewSecretKey() {
  const analytics = useAnalytics();
  const defaultWalletSecretKey = useDefaultWalletSecretKey();
  const [showSecretKey, setShowSecretKey] = useState(false);

  useEffect(() => {
    void analytics.page('view', '/save-secret-key');
  }, [analytics]);

  if (showSecretKey) {
    return (
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
    );
  }

  return (
    <>
      <RequestPassword onSuccess={() => setShowSecretKey(true)} />
      <Outlet />
    </>
  );
}
