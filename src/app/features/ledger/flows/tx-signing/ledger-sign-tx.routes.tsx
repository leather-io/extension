import { Route } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';

import {
  ConnectLedgerError,
  ConnectLedgerSuccessLayout,
  DeviceBusy,
  LedgerDisconnected,
  LedgerPublicKeyMismatch,
  OperationRejected,
  UnsupportedBrowserLayout,
  LedgerDeviceInvalidPayload,
} from '../../generic-steps';

import { LedgerSignTxContainer } from './ledger-sign-tx-container';
import { ConnectLedgerSignTx } from './steps/connect-ledger-sign-tx';
import { ApproveSignLedgerTx } from './steps/approve-sign-ledger-tx';

export const ledgerTxSigningRoutes = (
  <Route element={<LedgerSignTxContainer />}>
    <Route path={RouteUrls.ConnectLedger} element={<ConnectLedgerSignTx />} />
    <Route path={RouteUrls.DeviceBusy} element={<DeviceBusy />} />
    <Route path={RouteUrls.ConnectLedgerError} element={<ConnectLedgerError />} />
    <Route path={RouteUrls.LedgerUnsupportedBrowser} element={<UnsupportedBrowserLayout />} />
    <Route path={RouteUrls.ConnectLedgerSuccess} element={<ConnectLedgerSuccessLayout />} />
    <Route path={RouteUrls.AwaitingDeviceUserAction} element={<ApproveSignLedgerTx />} />
    <Route path={RouteUrls.LedgerDisconnected} element={<LedgerDisconnected />} />
    <Route path={RouteUrls.LedgerOperationRejected} element={<OperationRejected />} />
    <Route path={RouteUrls.LedgerPublicKeyMismatch} element={<LedgerPublicKeyMismatch />} />
    <Route path={RouteUrls.LedgerDevicePayloadInvalid} element={<LedgerDeviceInvalidPayload />} />
  </Route>
);
