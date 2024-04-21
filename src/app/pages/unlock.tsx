import { Outlet, useNavigate } from 'react-router-dom';

import { RequestPassword } from '@app/components/request-password';

export function Unlock() {
  const navigate = useNavigate();

  // Here we want to return to the previous route. The user could land on any
  // page when the wallet is locked, so we can't assume as single route.
  const returnToPreviousRoute = () => navigate(-1);

  return (
    <>
      <RequestPassword onSuccess={returnToPreviousRoute} />
      <Outlet />
    </>
  );
}
