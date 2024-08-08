import { Outlet, useNavigate } from 'react-router-dom';

import { Content } from '@app/components/layout';
import { RequestPassword } from '@app/components/request-password';
import { PageHeader } from '@app/features/container/headers/page.header';

export function Unlock() {
  const navigate = useNavigate();
  // Here we want to return to the previous route. The user could land on any
  // page when the wallet is locked, so we can't assume as single route.
  const returnToPreviousRoute = () => navigate(-1);

  return (
    <>
      <PageHeader isSessionLocked />
      <Content>
        <RequestPassword onSuccess={returnToPreviousRoute} />
        <Outlet />
      </Content>
    </>
  );
}
