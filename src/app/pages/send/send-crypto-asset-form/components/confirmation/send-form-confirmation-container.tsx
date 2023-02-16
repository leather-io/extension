import { Outlet } from 'react-router-dom';

import { SendFormConfirmationLayout } from './components/send-form-confirmation.layout';

export function SendFormConfirmationContainer() {
  return (
    <SendFormConfirmationLayout>
      <Outlet />
    </SendFormConfirmationLayout>
  );
}
