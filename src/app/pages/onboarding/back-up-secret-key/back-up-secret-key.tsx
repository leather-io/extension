import { memo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClipboard } from '@stacks/ui';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useWallet } from '@app/common/hooks/use-wallet';
import { RouteUrls } from '@shared/route-urls';

import { BackUpSecretKeyLayout } from './back-up-secret-key.layout';

export const BackUpSecretKeyPage = memo(() => {
  const { secretKey } = useWallet();
  const { onCopy, hasCopied } = useClipboard(secretKey || '');
  const navigate = useNavigate();

  const analytics = useAnalytics();

  useEffect(() => {
    if (!secretKey) navigate(RouteUrls.Onboarding);
  }, [navigate, secretKey]);

  const copyToClipboard = () => {
    void analytics.track('copy_secret_key_to_clipboard');
    onCopy();
  };

  return (
    <BackUpSecretKeyLayout
      hasCopied={hasCopied}
      onBackedUpSecretKey={() => navigate(RouteUrls.SetPassword)}
      onCopyToClipboard={copyToClipboard}
      secretKey={secretKey}
    />
  );
});
