import { Route } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';

import { ApproveSignLedgerTx } from '../../flows/stacks-tx-signing/steps/approve-sign-ledger-tx';
import { ConnectLedgerSignTx } from '../../flows/stacks-tx-signing/steps/connect-ledger-sign-tx';
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

interface LedgerSignTxRoutesProps {
  component: React.ReactNode;
}
export function ledgerSignTxRoutes({ component }: LedgerSignTxRoutesProps) {
  return (
    <Route element={component}>
      <Route path={RouteUrls.ConnectLedger} element={<ConnectLedgerSignTx />} />
      <Route path={RouteUrls.DeviceBusy} element={<DeviceBusy />} />
      <Route path={RouteUrls.ConnectLedgerError} element={<ConnectLedgerError />} />
      <Route path={RouteUrls.LedgerUnsupportedBrowser} element={<UnsupportedBrowserLayout />} />
      <Route path={RouteUrls.ConnectLedgerSuccess} element={<ConnectLedgerSuccess />} />
      <Route path={RouteUrls.AwaitingDeviceUserAction} element={<ApproveSignLedgerTx />} />
      <Route path={RouteUrls.LedgerDisconnected} element={<LedgerDisconnected />} />
      <Route path={RouteUrls.LedgerOperationRejected} element={<OperationRejected />} />
      <Route path={RouteUrls.LedgerPublicKeyMismatch} element={<LedgerPublicKeyMismatch />} />
      <Route path={RouteUrls.LedgerDevicePayloadInvalid} element={<LedgerDeviceInvalidPayload />} />
      <Route path={RouteUrls.LedgerOutdatedAppWarning} element={<ContractPrincipalBugWarning />} />
      <Route path={RouteUrls.LedgerBroadcastError} element={<LedgerBroadcastError />} />
    </Route>
  );
}
