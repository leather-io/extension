import { useEffect, useState } from 'react';
import { Outlet, Route, useLocation } from 'react-router-dom';

import * as btc from '@scure/btc-signer';
import { hexToBytes } from '@stacks/common';
import get from 'lodash.get';

import { logger } from '@shared/logger';
import { RouteUrls } from '@shared/route-urls';

import { useLocationState, useLocationStateWithCache } from '@app/common/hooks/use-location-state';
import { useScrollLock } from '@app/common/hooks/use-scroll-lock';
import { appEvents } from '@app/common/publish-subscribe';
import { delay } from '@app/common/utils';
import { BaseDrawer } from '@app/components/drawer/base-drawer';
import {
  LedgerTxSigningContext,
  LedgerTxSigningProvider,
} from '@app/features/ledger/generic-flows/tx-signing/ledger-sign-tx.context';
import { useActionCancellableByUser } from '@app/features/ledger/utils/stacks-ledger-utils';
import { useSignLedgerBitcoinTx } from '@app/store/accounts/blockchain/bitcoin/bitcoin.hooks';

import { ledgerSignTxRoutes } from '../../generic-flows/tx-signing/ledger-sign-tx-route-generator';
import { useLedgerAnalytics } from '../../hooks/use-ledger-analytics.hook';
import { useLedgerNavigate } from '../../hooks/use-ledger-navigate';
import { connectLedgerBitcoinApp, getBitcoinAppVersion } from '../../utils/bitcoin-ledger-utils';
import { useLedgerResponseState } from '../../utils/generic-ledger-utils';
import { ApproveSignLedgerBitcoinTx } from './steps/approve-bitcoin-sign-ledger-tx';

export const ledgerBitcoinTxSigningRoutes = ledgerSignTxRoutes({
  component: <LedgerSignBitcoinTxContainer />,
  customRoutes: (
    <Route path={RouteUrls.AwaitingDeviceUserAction} element={<ApproveSignLedgerBitcoinTx />} />
  ),
});

function LedgerSignBitcoinTxContainer() {
  const location = useLocation();
  const ledgerNavigate = useLedgerNavigate();
  const ledgerAnalytics = useLedgerAnalytics();
  useScrollLock(true);

  const canUserCancelAction = useActionCancellableByUser();
  const [unsignedTransactionRaw, setUnsignedTransactionRaw] = useState<null | string>(null);
  const [unsignedTransaction, setUnsignedTransaction] = useState<null | btc.Transaction>(null);
  const signLedger = useSignLedgerBitcoinTx();

  const inputsToSign = useLocationStateWithCache<number[]>('inputsToSign');
  const allowUserToGoBack = useLocationState<boolean>('goBack');

  useEffect(() => {
    const tx = get(location.state, 'tx');
    if (tx) {
      setUnsignedTransactionRaw(tx);
      setUnsignedTransaction(btc.Transaction.fromPSBT(hexToBytes(tx)));
    }
  }, [location.state]);

  useEffect(() => () => setUnsignedTransaction(null), []);

  const [latestDeviceResponse, setLatestDeviceResponse] = useLedgerResponseState();

  const [awaitingDeviceConnection, setAwaitingDeviceConnection] = useState(false);

  const signTransaction = async () => {
    setAwaitingDeviceConnection(true);
    const bitcoinApp = await connectLedgerBitcoinApp();

    try {
      const versionInfo = await getBitcoinAppVersion(bitcoinApp);

      ledgerAnalytics.trackDeviceVersionInfo(versionInfo);
      setAwaitingDeviceConnection(false);

      setLatestDeviceResponse(versionInfo as any);
    } catch (e) {}

    ledgerNavigate.toDeviceBusyStep('Verifying public key on Ledger…');

    ledgerNavigate.toConnectionSuccessStep('bitcoin');
    await delay(1200);
    if (!unsignedTransaction) throw new Error('No unsigned tx');

    ledgerNavigate.toAwaitingDeviceOperation({ hasApprovedOperation: false });

    try {
      const btcTx = await signLedger(bitcoinApp, unsignedTransaction.toPSBT(), inputsToSign);

      if (!btcTx || !unsignedTransactionRaw) throw new Error('No tx returned');
      ledgerNavigate.toAwaitingDeviceOperation({ hasApprovedOperation: true });
      await delay(1200);
      appEvents.publish('ledgerBitcoinTxSigned', {
        signedPsbt: btcTx,
        unsignedPsbt: unsignedTransactionRaw,
      });
    } catch (e) {
      logger.error('Unable to sign tx with ledger', e);
      ledgerAnalytics.transactionSignedOnLedgerRejected();
      ledgerNavigate.toOperationRejectedStep();
    } finally {
      void bitcoinApp.transport.close();
    }
  };

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
