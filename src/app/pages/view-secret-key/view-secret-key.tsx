import { memo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stack, useClipboard } from '@stacks/ui';

import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { useWallet } from '@app/common/hooks/use-wallet';
import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { isFullPage } from '@app/common/utils';
import { Header } from '@app/components/header';
import { fullPageContent } from '@app/pages/pages.styles';
import { RouteUrls } from '@shared/route-urls';

import { ViewSecretKeyActions } from './components/view-secret-key-actions';
import { ViewSecretKeyMessage } from './components/view-secret-key-message';
import { ViewSecretKeyCard } from './components/view-secret-key-card';

export const ViewSecretKey = memo(() => {
  const { secretKey } = useWallet();
  const analytics = useAnalytics();
  const navigate = useNavigate();
  const { onCopy, hasCopied } = useClipboard(secretKey || '');

  const wordCount = (secretKey || '').split(' ').length;

  useRouteHeader(<Header onClose={() => navigate(RouteUrls.Home)} title="Your Secret Key" />);

  useEffect(() => {
    void analytics.page('view', '/save-secret-key');
  }, [analytics]);

  const copyToClipboard = () => {
    void analytics.track('copy_secret_key_to_clipboard');
    onCopy();
  };

  const handleOnClick = () => {
    navigate(RouteUrls.Home);
  };

  return (
    <Stack className={isFullPage ? fullPageContent : undefined} spacing="loose">
      <ViewSecretKeyMessage wordCount={wordCount} />
      <ViewSecretKeyCard secretKey={secretKey} />
      <ViewSecretKeyActions
        hasCopied={hasCopied}
        onClick={handleOnClick}
        onCopyToClipboard={copyToClipboard}
      />
    </Stack>
  );
});
