import { Route } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';

import { BtcSendFormConfirmation } from '../../btc/btc-send-form-confirmation';
import { StacksSip10SendFormConfirmation } from '../../stacks-sip10/stacks-sip10-send-form-confirmation';
import { StxSendFormConfirmation } from '../../stx/stx-send-form-confirmation';
import { SendFormConfirmationContainer } from './send-form-confirmation-container';

export const sendFormConfirmationRoutes = (
  <Route element={<SendFormConfirmationContainer />}>
    <Route
      path={RouteUrls.SendBtcCryptoCurrencyConfirmation}
      element={<BtcSendFormConfirmation />}
    />
    <Route
      path={RouteUrls.SendStxCryptoCurrencyConfirmation}
      element={<StxSendFormConfirmation />}
    />
    <Route
      path={RouteUrls.SendStacksSip10Confirmation}
      element={<StacksSip10SendFormConfirmation />}
    />
  </Route>
);
