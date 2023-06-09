import { Route } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';

import {
  ConnectLedgerError,
  ConnectLedgerSuccess,
  DeviceBusy,
  LedgerDeviceInvalidPayload,
  LedgerDisconnected,
  LedgerPublicKeyMismatch,
  OperationRejected,
  UnsupportedBrowserLayout,
} from '../../generic-steps';
import { LedgerSignMsgContainer } from './ledger-stacks-sign-msg-container';
import { ConnectLedgerSignMsg } from './steps/connect-ledger-sign-msg';
import { SignLedgerMessage } from './steps/sign-stacks-ledger-message';

export const ledgerStacksMessageSigningRoutes = (
  <Route element={<LedgerSignMsgContainer />}>
    <Route path={RouteUrls.ConnectLedger} element={<ConnectLedgerSignMsg />} />
    <Route path={RouteUrls.DeviceBusy} element={<DeviceBusy />} />
    <Route path={RouteUrls.ConnectLedgerError} element={<ConnectLedgerError />} />
    <Route path={RouteUrls.ConnectLedgerSuccess} element={<ConnectLedgerSuccess />} />
    <Route path={RouteUrls.AwaitingDeviceUserAction} element={<SignLedgerMessage />} />
    <Route path={RouteUrls.LedgerDisconnected} element={<LedgerDisconnected />} />
    <Route path={RouteUrls.LedgerOperationRejected} element={<OperationRejected />} />
    <Route path={RouteUrls.LedgerPublicKeyMismatch} element={<LedgerPublicKeyMismatch />} />
    <Route path={RouteUrls.LedgerUnsupportedBrowser} element={<UnsupportedBrowserLayout />} />
    <Route path={RouteUrls.LedgerDevicePayloadInvalid} element={<LedgerDeviceInvalidPayload />} />
  </Route>
);
