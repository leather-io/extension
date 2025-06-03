import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { Content } from '@app/components/layout';
import { RequestPassword } from '@app/components/request-password';
import { UnlockHeader } from '@app/features/container/headers/unlock.header';

export function Unlock() {
  const navigate = useNavigate();
  const location = useLocation();
  // Here we want to return to the previous route. The user could land on any
  // page when the wallet is locked, so we can't assume as single route.
  function returnToPreviousRoute() {
    if (location.state?.from) {
      return navigate(location.state.from, { replace: true });
    } else {
      return navigate('/', { replace: true });
    }
  }

  return (
    <>
      <UnlockHeader />
      <Content>
        <RequestPassword onSuccess={returnToPreviousRoute} showForgotPassword />
        <Outlet />
      </Content>
    </>
  );
}
