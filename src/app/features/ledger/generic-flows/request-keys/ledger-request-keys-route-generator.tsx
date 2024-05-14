import { Route } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';

import {
  ConnectLedgerError,
  ConnectLedgerSuccess,
  DeviceBusy,
  UnsupportedBrowserLayout,
} from '../../generic-steps';
import { ConnectLedgerRequestKeys } from './steps/connect-ledger-request-keys';

interface LedgerRequestKeysRoutesProps {
  path: string;
  component: React.ReactNode;
}
export function ledgerRequestKeysRoutes({ path, component }: LedgerRequestKeysRoutesProps) {
  return (
    <Route path={path} element={component}>
      <Route path={RouteUrls.ConnectLedger} element={<ConnectLedgerRequestKeys />} />
      <Route path={RouteUrls.DeviceBusy} element={<DeviceBusy />} />
      <Route path={RouteUrls.ConnectLedgerError} element={<ConnectLedgerError />} />
      <Route path={RouteUrls.ConnectLedgerSuccess} element={<ConnectLedgerSuccess />} />
      <Route path={RouteUrls.LedgerUnsupportedBrowser} element={<UnsupportedBrowserLayout />} />
    </Route>
  );
}
