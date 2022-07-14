import { Route } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';
import { LedgerRequestKeysContainer } from './ledger-request-keys-container';
import { ConnectLedgerRequestKeys } from './steps/connect-ledger-request-keys';
import { PullingKeysFromDevice } from './steps/pulling-keys-from-device';
import { ConnectLedgerRequestKeysError } from './steps/connect-ledger-request-keys-error';
import { UnsupportedBrowserLayout } from '../../steps/unsupported-browser.layout';
import { ConnectLedgerOnboardingSuccess } from './steps/connect-ledger-request-keys-success';

export const ledgerRequestKeysRoutes = (
  <Route element={<LedgerRequestKeysContainer />}>
    <Route path={RouteUrls.ConnectLedger} element={<ConnectLedgerRequestKeys />} />
    <Route path={RouteUrls.DeviceBusy} element={<PullingKeysFromDevice />} />
    <Route path={RouteUrls.ConnectLedgerError} element={<ConnectLedgerRequestKeysError />} />
    <Route path={RouteUrls.LedgerUnsupportedBrowser} element={<UnsupportedBrowserLayout />} />
    <Route path={RouteUrls.ConnectLedgerSuccess} element={<ConnectLedgerOnboardingSuccess />} />
  </Route>
);
