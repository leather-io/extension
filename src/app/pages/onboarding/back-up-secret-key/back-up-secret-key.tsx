import { memo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';
import { BackUpSecretKeyLayout } from './back-up-secret-key.layout';
import { useGeneratedSecretKey } from '@app/store/keys/key.selectors';
import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { Header } from '@app/components/header';
import { SecretKeyDisplayer } from '@app/features/secret-key-displayer/secret-key-displayer';

export const BackUpSecretKeyPage = memo(() => {
  const secretKey = useGeneratedSecretKey();
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
