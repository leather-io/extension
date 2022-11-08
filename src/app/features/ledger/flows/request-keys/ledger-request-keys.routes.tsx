import { Route } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';

import {
  ConnectLedgerError,
  ConnectLedgerSuccessLayout,
  DeviceBusy,
  UnsupportedBrowserLayout,
} from '../../generic-steps';
import { LedgerRequestKeysContainer } from './ledger-request-keys-container';
import { ConnectLedgerRequestKeys } from './steps/connect-ledger-request-keys';

export const ledgerRequestKeysRoutes = (
  <Route element={<LedgerRequestKeysContainer />}>
    <Route path={RouteUrls.ConnectLedger} element={<ConnectLedgerRequestKeys />} />
    <Route path={RouteUrls.DeviceBusy} element={<DeviceBusy />} />
    <Route path={RouteUrls.ConnectLedgerError} element={<ConnectLedgerError />} />
    <Route path={RouteUrls.ConnectLedgerSuccess} element={<ConnectLedgerSuccessLayout />} />
    <Route path={RouteUrls.LedgerUnsupportedBrowser} element={<UnsupportedBrowserLayout />} />
  </Route>
);
