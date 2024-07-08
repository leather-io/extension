import { Outlet, useNavigate } from 'react-router-dom';

import { RequestPassword } from '@app/components/request-password';
import { useUpdatePageHeaderContext } from '@app/features/container/containers/page/page.context';

export function Unlock() {
  const navigate = useNavigate();
  // PETE - critical to make sure this resets the state of the page header on unlock
  //  Pete this doesn't reset which is bad and could indicate titles won't reset also
  // look into that article with useRef
  // finish other work first though
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
