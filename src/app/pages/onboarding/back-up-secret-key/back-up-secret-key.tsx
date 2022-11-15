import { memo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';

import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { Header } from '@app/components/header';
import { SecretKeyDisplayer } from '@app/features/secret-key-displayer/secret-key-displayer';
import { useDefaultWalletSecretKey } from '@app/store/in-memory-key/in-memory-key.selectors';

import { BackUpSecretKeyLayout } from './back-up-secret-key.layout';

export const BackUpSecretKeyPage = memo(() => {
  const secretKey = useDefaultWalletSecretKey();
  const navigate = useNavigate();

  useRouteHeader(<Header hideActions />);

  useEffect(() => {
    if (!secretKey) navigate(RouteUrls.Onboarding);
  }, [navigate, secretKey]);

  if (!secretKey) return null;

  return (
    <BackUpSecretKeyLayout
      secretKeyDisplay={<SecretKeyDisplayer secretKey={secretKey} />}
      onBackedUpSecretKey={() => navigate(RouteUrls.SetPassword)}
    />
  );
});
