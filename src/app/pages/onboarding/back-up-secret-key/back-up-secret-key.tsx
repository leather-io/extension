import { memo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';
import { BackUpSecretKeyLayout } from './back-up-secret-key.layout';
import { useGeneratedSecretKey } from '@app/store/keys/key.selectors';

export const BackUpSecretKeyPage = memo(() => {
  const secretKey = useGeneratedSecretKey();
  const navigate = useNavigate();

  useEffect(() => {
    if (!secretKey) navigate(RouteUrls.Onboarding);
  }, [navigate, secretKey]);

  return <BackUpSecretKeyLayout onBackedUpSecretKey={() => navigate(RouteUrls.SetPassword)} />;
});
