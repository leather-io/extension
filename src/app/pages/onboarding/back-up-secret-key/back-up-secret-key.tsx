import { memo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useWallet } from '@app/common/hooks/use-wallet';
import { RouteUrls } from '@shared/route-urls';

import { BackUpSecretKeyLayout } from './back-up-secret-key.layout';

export const BackUpSecretKeyPage = memo(() => {
  const { secretKey } = useWallet();
  const navigate = useNavigate();

  useEffect(() => {
    if (!secretKey) navigate(RouteUrls.Onboarding);
  }, [navigate, secretKey]);

  return <BackUpSecretKeyLayout onBackedUpSecretKey={() => navigate(RouteUrls.SetPassword)} />;
});
