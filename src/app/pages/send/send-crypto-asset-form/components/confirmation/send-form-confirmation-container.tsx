import { Outlet, useNavigate } from 'react-router-dom';

import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { Header } from '@app/components/header';

import { SendFormConfirmationLayout } from './components/send-form-confirmation.layout';

export function SendFormConfirmationContainer() {
  const navigate = useNavigate();

  useRouteHeader(<Header hideActions onClose={() => navigate(-1)} title="You'll send" />);

  return (
    <SendFormConfirmationLayout>
      <Outlet />
    </SendFormConfirmationLayout>
  );
}
