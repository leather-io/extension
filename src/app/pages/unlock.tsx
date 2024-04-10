import { Outlet, useNavigate } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';

import { RequestPassword } from '@app/components/request-password';

export function Unlock() {
  const navigate = useNavigate();

  const handleSuccess = () => navigate(RouteUrls.Home);

  return (
    <>
      <RequestPassword onSuccess={handleSuccess} />
      <Outlet />
    </>
  );
}
