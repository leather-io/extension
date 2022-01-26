import { memo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClipboard } from '@stacks/ui';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { RouteUrls } from '@shared/route-urls';
import { useGeneratedSecretKey } from '@app/store/keys/key.selectors';
import { useDefaultWalletSecretKey } from '@app/store/in-memory-key/in-memory-key.selectors';
import { BackUpSecretKeyLayout } from './back-up-secret-key.layout';

export const BackUpSecretKeyPage = memo(() => {
  const navigate = useNavigate();
  const analytics = useAnalytics();

  const tmpSecretKey = useGeneratedSecretKey();
  const defaultWalletSecretKey = useDefaultWalletSecretKey();
  const secretKey = defaultWalletSecretKey ?? tmpSecretKey;
  const { onCopy, hasCopied } = useClipboard(secretKey || '');

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
      secretKey={secretKey ?? ''}
    />
  );
});
