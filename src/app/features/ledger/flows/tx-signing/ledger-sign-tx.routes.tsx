import { Route } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';
import { LedgerSignTxContainer } from './ledger-sign-tx-container';
import { ConnectLedgerSignTx } from './steps/connect-ledger-sign-tx';
import { VerifyingPublicKeysMatch } from './steps/verifying-public-keys-match';
import { ConnectLedgerSignTxError } from './steps/connect-ledger-sign-tx-error';
import { ConnectLedgerSignTxSuccess } from './steps/connect-ledger-sign-tx-success';
import { SignLedgerTransaction } from './steps/sign-ledger-transaction';
import { LedgerDisconnected } from './steps/ledger-disconnected';
import { LedgerTransactionRejected } from './steps/transaction-rejected';
import { LedgerPublicKeyMismatch } from './steps/public-key-mismatch';
import { UnsupportedBrowserLayout } from '../../steps/unsupported-browser.layout';
import { LedgerDeviceInvalidTx } from './steps/device-invalid-tx';

export const ledgerTxSigningRoutes = (
  <Route element={<LedgerSignTxContainer />}>
    <Route path={RouteUrls.ConnectLedger} element={<ConnectLedgerSignTx />} />
    <Route path={RouteUrls.DeviceBusy} element={<VerifyingPublicKeysMatch />} />
    <Route path={RouteUrls.ConnectLedgerError} element={<ConnectLedgerSignTxError />} />
    <Route path={RouteUrls.ConnectLedgerSuccess} element={<ConnectLedgerSignTxSuccess />} />
    <Route path={RouteUrls.AwaitingDeviceUserAction} element={<SignLedgerTransaction />} />
    <Route path={RouteUrls.LedgerDisconnected} element={<LedgerDisconnected />} />
    <Route path={RouteUrls.LedgerOperationRejected} element={<LedgerTransactionRejected />} />
    <Route path={RouteUrls.LedgerPublicKeyMismatch} element={<LedgerPublicKeyMismatch />} />
    <Route path={RouteUrls.LedgerDeviceTxInvalid} element={<LedgerDeviceInvalidTx />} />
    <Route path={RouteUrls.LedgerUnsupportedBrowser} element={<UnsupportedBrowserLayout />} />
  </Route>
);
