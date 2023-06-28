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
import { LedgerBroadcastError } from '../../generic-steps/broadcast-error/broadcast-error';
import { LedgerSignStacksTxContainer } from './ledger-sign-tx-container';
import { ApproveSignLedgerTx } from './steps/approve-sign-ledger-tx';
import { ConnectLedgerSignTx } from './steps/connect-ledger-sign-tx';
import { ContractPrincipalBugWarning } from './steps/contract-principal-bug-warning';

export const ledgerStacksTxSigningRoutes = (
  <Route element={<LedgerSignStacksTxContainer />}>
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
    <Route path={RouteUrls.LedgerOutdatedAppWarning} element={<ContractPrincipalBugWarning />} />
    <Route path={RouteUrls.LedgerBroadcastError} element={<LedgerBroadcastError />} />
  </Route>
);
