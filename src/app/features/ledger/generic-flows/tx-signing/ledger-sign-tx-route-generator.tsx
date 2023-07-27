import React from 'react';
import { Route } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';

import { ContractPrincipalBugWarning } from '../../flows/stacks-tx-signing/steps/contract-principal-bug-warning';
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
import { LedgerBroadcastError } from '../../generic-steps/broadcast-error/broadcast-error';
import { ConnectLedgerSignTx } from './steps/connect-ledger-sign-tx';

interface LedgerSignTxRoutesProps {
  component: React.ReactNode;
  customRoutes: React.ReactNode;
}
export function ledgerSignTxRoutes({ component, customRoutes }: LedgerSignTxRoutesProps) {
  return (
    <Route element={component}>
      {customRoutes}
      <Route path={RouteUrls.ConnectLedger} element={<ConnectLedgerSignTx />} />
      <Route path={RouteUrls.DeviceBusy} element={<DeviceBusy />} />
      <Route path={RouteUrls.ConnectLedgerError} element={<ConnectLedgerError />} />
      <Route path={RouteUrls.LedgerUnsupportedBrowser} element={<UnsupportedBrowserLayout />} />
      <Route path={RouteUrls.ConnectLedgerSuccess} element={<ConnectLedgerSuccess />} />
      <Route path={RouteUrls.LedgerDisconnected} element={<LedgerDisconnected />} />
      <Route path={RouteUrls.LedgerOperationRejected} element={<OperationRejected />} />
      <Route path={RouteUrls.LedgerPublicKeyMismatch} element={<LedgerPublicKeyMismatch />} />
      <Route path={RouteUrls.LedgerDevicePayloadInvalid} element={<LedgerDeviceInvalidPayload />} />
      <Route path={RouteUrls.LedgerOutdatedAppWarning} element={<ContractPrincipalBugWarning />} />
      <Route path={RouteUrls.LedgerBroadcastError} element={<LedgerBroadcastError />} />
    </Route>
  );
}
