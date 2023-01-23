import { Outlet, useNavigate } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';

import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { Header } from '@app/components/header';

import { SendFormConfirmationLayout } from './components/send-form-confirmation.layout';

export function SendFormConfirmationContainer() {
  const navigate = useNavigate();

  useRouteHeader(
    <Header hideActions onClose={() => navigate(RouteUrls.SendCryptoAsset)} title="You'll send" />
  );

  return (
    <SendFormConfirmationLayout>
      <Outlet />
    </SendFormConfirmationLayout>
  );
}
