import { Route } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';
import { LedgerSignJwtContainer } from './ledger-sign-jwt-container';
import { ConnectLedgerSignJwt } from './steps/connect-ledger-sign-jwt';
import { ConnectLedgerSignJwtError } from './steps/connect-ledger-sign-jwt-error';
import { ConnectLedgerSignJwtSuccess } from './steps/connect-ledger-sign-jwt-success';
import { LedgerJwtSigningRejected } from './steps/transaction-rejected';
import { SignJwtHash } from './steps/sign-jwt-hash';
import { LedgerDisconnected } from '../tx-signing/steps/ledger-disconnected';

export const ledgerJwtSigningRoutes = (
  <Route element={<LedgerSignJwtContainer />}>
    <Route path={RouteUrls.ConnectLedger} element={<ConnectLedgerSignJwt />} />
    <Route path={RouteUrls.ConnectLedgerError} element={<ConnectLedgerSignJwtError />} />
    <Route path={RouteUrls.ConnectLedgerSuccess} element={<ConnectLedgerSignJwtSuccess />} />
    <Route path={RouteUrls.LedgerOperationRejected} element={<LedgerJwtSigningRejected />} />
    <Route path={RouteUrls.AwaitingDeviceUserAction} element={<SignJwtHash />} />
    <Route path={RouteUrls.LedgerDisconnected} element={<LedgerDisconnected />} />
  </Route>
);
