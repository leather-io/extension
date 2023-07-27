import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Outlet, Route, useLocation, useNavigate } from 'react-router-dom';

import * as btc from '@scure/btc-signer';
import { hexToBytes } from '@stacks/common';
import get from 'lodash.get';

import { RouteUrls } from '@shared/route-urls';

import { useScrollLock } from '@app/common/hooks/use-scroll-lock';
import { delay } from '@app/common/utils';
import { BaseDrawer } from '@app/components/drawer/base-drawer';
import {
  LedgerTxSigningContext,
  LedgerTxSigningProvider,
} from '@app/features/ledger/generic-flows/tx-signing/ledger-sign-tx.context';
import { useActionCancellableByUser } from '@app/features/ledger/utils/stacks-ledger-utils';
import { useSendFormNavigate } from '@app/pages/send/send-crypto-asset-form/hooks/use-send-form-navigate';
import { useBitcoinBroadcastTransaction } from '@app/query/bitcoin/transaction/use-bitcoin-broadcast-transaction';
import { useSignLedgerTx } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';

import { ConnectLedgerSignTx } from '../../generic-flows/tx-signing/steps/connect-ledger-sign-tx';
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
import { useLedgerAnalytics } from '../../hooks/use-ledger-analytics.hook';
import { useLedgerNavigate } from '../../hooks/use-ledger-navigate';
import { connectLedgerBitcoinApp, getBitcoinAppVersion } from '../../utils/bitcoin-ledger-utils';
import { useLedgerResponseState } from '../../utils/generic-ledger-utils';
import { ApproveBitcoinSignLedgerTx } from './steps/approve-bitcoin-sign-ledger-tx';

export const ledgerBitcoinTxSigningRoutes = (
  <Route element={<LedgerSignBitcoinTxContainer />}>
    {/* TODO: find way to refactor common routes */}
    <Route path={RouteUrls.ConnectLedger} element={<ConnectLedgerSignTx />} />
    <Route path={RouteUrls.DeviceBusy} element={<DeviceBusy />} />
    <Route path={RouteUrls.ConnectLedgerError} element={<ConnectLedgerError />} />
    <Route path={RouteUrls.LedgerUnsupportedBrowser} element={<UnsupportedBrowserLayout />} />
    <Route path={RouteUrls.ConnectLedgerSuccess} element={<ConnectLedgerSuccess />} />
    <Route path={RouteUrls.AwaitingDeviceUserAction} element={<ApproveBitcoinSignLedgerTx />} />
    <Route path={RouteUrls.LedgerDisconnected} element={<LedgerDisconnected />} />
    <Route path={RouteUrls.LedgerOperationRejected} element={<OperationRejected />} />
    <Route path={RouteUrls.LedgerPublicKeyMismatch} element={<LedgerPublicKeyMismatch />} />
    <Route path={RouteUrls.LedgerDevicePayloadInvalid} element={<LedgerDeviceInvalidPayload />} />
    <Route path={RouteUrls.LedgerBroadcastError} element={<LedgerBroadcastError />} />
  </Route>
);

export function LedgerSignBitcoinTxContainer() {
  const location = useLocation();
  const ledgerNavigate = useLedgerNavigate();
  const ledgerAnalytics = useLedgerAnalytics();
  useScrollLock(true);

  const navigate = useNavigate();
  const { broadcastTx } = useBitcoinBroadcastTransaction();
  const canUserCancelAction = useActionCancellableByUser();
  const [unsignedTransaction, setUnsignedTransaction] = useState<null | btc.Transaction>(null);
  const signLedger = useSignLedgerTx();
  const sendFormNavigate = useSendFormNavigate();

  useEffect(() => {
    const tx = get(location.state, 'tx');
    if (tx) console.log({ tx, decoded: btc.Transaction.fromPSBT(hexToBytes(tx)) });
    if (tx) setUnsignedTransaction(btc.Transaction.fromPSBT(hexToBytes(tx)));
  }, [location.state]);

  useEffect(() => () => setUnsignedTransaction(null), []);

  const [latestDeviceResponse, setLatestDeviceResponse] = useLedgerResponseState();

  const [awaitingDeviceConnection, setAwaitingDeviceConnection] = useState(false);

  const signTransaction = async () => {
    const bitcoinApp = await connectLedgerBitcoinApp();

    const versionInfo = await getBitcoinAppVersion(bitcoinApp);
    ledgerAnalytics.trackDeviceVersionInfo(versionInfo);
    setLatestDeviceResponse(versionInfo as any);

    ledgerNavigate.toDeviceBusyStep('Verifying public key on Ledger…');

    // try {
    ledgerNavigate.toConnectionSuccessStep('bitcoin');
    await delay(1000);
    if (!unsignedTransaction) throw new Error('No unsigned tx');

    ledgerNavigate.toAwaitingDeviceOperation({ hasApprovedOperation: false });

    try {
      const resp = await signLedger(bitcoinApp, unsignedTransaction.toPSBT());
      if (!resp) throw new Error('No tx returned');
      console.log(resp);
      ledgerNavigate.toAwaitingDeviceOperation({ hasApprovedOperation: true });
      await delay(1000);

      await broadcastTx({
        tx: resp.hex,
        onSuccess(txid) {
          console.log(txid);
          toast.success('Tx broadcast');
          navigate('/activity', { replace: true });
        },
        onError(e) {
          console.log(e);
        },
      });
      navigate('/activity', { replace: true });
      // sendFormNavigate.toConfirmAndSignBtcTransaction({
      //   fee: 1000,
      //   feeRowValue: '1231',
      //   recipient: 'anslkdjfs',
      //   time: 'slkdjfslkdf',
      //   tx: resp?.toHex(),
      // });
    } catch (e) {
      console.log('error', e);
      ledgerAnalytics.transactionSignedOnLedgerRejected();
      ledgerNavigate.toOperationRejectedStep();
    }
  };

  const allowUserToGoBack = get(location.state, 'goBack');

  const ledgerContextValue: LedgerTxSigningContext = {
    chain: 'bitcoin',
    transaction: unsignedTransaction,
    signTransaction,
    latestDeviceResponse,
    awaitingDeviceConnection,
  };

  return (
    <LedgerTxSigningProvider value={ledgerContextValue}>
      <BaseDrawer
        enableGoBack={allowUserToGoBack}
        isShowing
        isWaitingOnPerformedAction={awaitingDeviceConnection || canUserCancelAction}
        onClose={ledgerNavigate.cancelLedgerAction}
        pauseOnClickOutside
        waitingOnPerformedActionMessage="Ledger device in use"
      >
        <Outlet />
      </BaseDrawer>
    </LedgerTxSigningProvider>
  );
}
