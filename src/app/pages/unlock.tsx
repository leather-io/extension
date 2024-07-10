import { Outlet, useNavigate } from 'react-router-dom';

import { useUpdatePageHeaderContext } from '@app/common/page/page.context';
import { RequestPassword } from '@app/components/request-password';

export function Unlock() {
  const navigate = useNavigate();
  useUpdatePageHeaderContext({ isSessionLocked: true });
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
