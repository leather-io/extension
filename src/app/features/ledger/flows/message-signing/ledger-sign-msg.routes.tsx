import { Route } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';

import {
  ConnectLedgerError,
  ConnectLedgerSuccessLayout,
  DeviceBusy,
  LedgerDeviceInvalidPayload,
  LedgerDisconnected,
  LedgerPublicKeyMismatch,
  OperationRejected,
  UnsupportedBrowserLayout,
} from '../../generic-steps';
import { LedgerSignMsgContainer } from './ledger-sign-msg-container';
import { ConnectLedgerSignMsg } from './steps/connect-ledger-sign-msg';
import { SignLedgerMessage } from './steps/sign-ledger-message';

export const ledgerMessageSigningRoutes = (
  <Route element={<LedgerSignMsgContainer />}>
    <Route path={RouteUrls.ConnectLedger} element={<ConnectLedgerSignMsg />} />
    <Route path={RouteUrls.DeviceBusy} element={<DeviceBusy />} />
    <Route path={RouteUrls.ConnectLedgerError} element={<ConnectLedgerError />} />
    <Route path={RouteUrls.ConnectLedgerSuccess} element={<ConnectLedgerSuccessLayout />} />
    <Route path={RouteUrls.AwaitingDeviceUserAction} element={<SignLedgerMessage />} />
    <Route path={RouteUrls.LedgerDisconnected} element={<LedgerDisconnected />} />
    <Route path={RouteUrls.LedgerOperationRejected} element={<OperationRejected />} />
    <Route path={RouteUrls.LedgerPublicKeyMismatch} element={<LedgerPublicKeyMismatch />} />
    <Route path={RouteUrls.LedgerUnsupportedBrowser} element={<UnsupportedBrowserLayout />} />
    <Route path={RouteUrls.LedgerDevicePayloadInvalid} element={<LedgerDeviceInvalidPayload />} />
  </Route>
);
