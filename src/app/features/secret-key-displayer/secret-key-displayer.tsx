import { memo, useMemo } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useClipboard } from '@app/common/hooks/use-copy-to-clipboard';

import { SecretKeyDisplayerLayout } from './secret-key-displayer.layout';

interface SecretKeyDisplayerProps {
  secretKey: string;
}
export const SecretKeyDisplayer = memo(({ secretKey }: SecretKeyDisplayerProps) => {
  const { onCopy, hasCopied } = useClipboard(secretKey || '');
  const { pathname } = useLocation();
  const analytics = useAnalytics();
  const navigate = useNavigate();

  const copyToClipboard = () => {
    void analytics.track('copy_secret_key_to_clipboard');
    onCopy();
  };

  const secretKeyWords = useMemo(() => secretKey?.split(' '), [secretKey]);
  const showTitleAndIllustration = pathname === RouteUrls.BackUpSecretKey;

  return (
    <>
      <SecretKeyDisplayerLayout
        hasCopied={hasCopied}
        onCopyToClipboard={copyToClipboard}
        secretKeyWords={secretKeyWords}
        showTitleAndIllustration={showTitleAndIllustration}
        onBackedUpSecretKey={() => navigate(RouteUrls.SetPassword)}
      />
      <Outlet />
    </>
  );
});
