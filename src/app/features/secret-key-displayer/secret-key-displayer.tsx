import { memo, useMemo } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';
import { analytics } from '@shared/utils/analytics';

import { useClipboard } from '@app/common/hooks/use-copy-to-clipboard';

import { SecretKeyLayout } from '../../ui/components/secret-key/secret-key.layout';

interface SecretKeyProps {
  secretKey: string;
}
export const SecretKey = memo(({ secretKey }: SecretKeyProps) => {
  const { onCopy, hasCopied } = useClipboard(secretKey || '');
  const { pathname } = useLocation();

  const navigate = useNavigate();

  const copyToClipboard = () => {
    void analytics.track('copy_secret_key_to_clipboard');
    onCopy();
  };

  const secretKeyWords = useMemo(() => secretKey?.split(' '), [secretKey]);
  const showTitleAndIllustration = pathname === RouteUrls.BackUpSecretKey;

  return (
    <>
      <SecretKeyLayout
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
