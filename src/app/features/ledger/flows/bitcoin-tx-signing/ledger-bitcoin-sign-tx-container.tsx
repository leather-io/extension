import { useEffect, useState } from 'react';
import { Route, useLocation } from 'react-router-dom';

import { bytesToHex } from '@noble/hashes/utils';
import * as btc from '@scure/btc-signer';
import { hexToBytes } from '@stacks/common';
import BitcoinApp from 'ledger-bitcoin';
import get from 'lodash.get';

import { delay } from '@leather.io/utils';

import { BitcoinInputSigningConfig } from '@shared/crypto/bitcoin/signer-config';
import { logger } from '@shared/logger';
import { RouteUrls } from '@shared/route-urls';

import { useLocationStateWithCache } from '@app/common/hooks/use-location-state';
import { useScrollLock } from '@app/common/hooks/use-scroll-lock';
import { appEvents } from '@app/common/publish-subscribe';
import { ApproveSignLedgerBitcoinTx } from '@app/features/ledger/flows/bitcoin-tx-signing/steps/approve-bitcoin-sign-ledger-tx';
import { ledgerSignTxRoutes } from '@app/features/ledger/generic-flows/tx-signing/ledger-sign-tx-route-generator';
import { LedgerTxSigningContext } from '@app/features/ledger/generic-flows/tx-signing/ledger-sign-tx.context';
import { TxSigningFlow } from '@app/features/ledger/generic-flows/tx-signing/tx-signing-flow';
import { useLedgerSignTx } from '@app/features/ledger/generic-flows/tx-signing/use-ledger-sign-tx';
import { useLedgerAnalytics } from '@app/features/ledger/hooks/use-ledger-analytics.hook';
import { useLedgerNavigate } from '@app/features/ledger/hooks/use-ledger-navigate';
import {
  connectLedgerBitcoinApp,
  getBitcoinAppVersion,
  isBitcoinAppOpen,
} from '@app/features/ledger/utils/bitcoin-ledger-utils';
import { useCancelLedgerAction } from '@app/features/ledger/utils/generic-ledger-utils';
import { useToast } from '@app/features/toasts/use-toast';
import { useSignLedgerBitcoinTx } from '@app/store/accounts/blockchain/bitcoin/bitcoin.hooks';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';

export const ledgerBitcoinTxSigningRoutes = ledgerSignTxRoutes({
  component: <LedgerSignBitcoinTxContainer />,
  customRoutes: (
    <Route path={RouteUrls.AwaitingDeviceUserAction} element={<ApproveSignLedgerBitcoinTx />} />
  ),
});

function LedgerSignBitcoinTxContainer() {
  const toast = useToast();
  const location = useLocation();
  const ledgerNavigate = useLedgerNavigate();
  const ledgerAnalytics = useLedgerAnalytics();
  useScrollLock(true);

  const [unsignedTransactionRaw, setUnsignedTransactionRaw] = useState<null | string>(null);
  const [unsignedTransaction, setUnsignedTransaction] = useState<null | btc.Transaction>(null);
  const signLedger = useSignLedgerBitcoinTx();
  const network = useCurrentNetwork();

  const inputsToSign = useLocationStateWithCache<BitcoinInputSigningConfig[]>('inputsToSign');

  useEffect(() => {
    const tx = get(location.state, 'tx');
    if (tx) {
      setUnsignedTransactionRaw(tx);
      setUnsignedTransaction(btc.Transaction.fromPSBT(hexToBytes(tx)));
    }
  }, [location.state]);

  useEffect(() => () => setUnsignedTransaction(null), []);

  const chain = 'bitcoin';

  const { signTransaction, latestDeviceResponse, awaitingDeviceConnection } =
    useLedgerSignTx<BitcoinApp>({
      chain,
      isAppOpen: isBitcoinAppOpen({ network: network.chain.bitcoin.mode }),
      getAppVersion: getBitcoinAppVersion,
      connectApp: connectLedgerBitcoinApp(network.chain.bitcoin.mode),
      async signTransactionWithDevice(bitcoinApp) {
        if (!inputsToSign) {
          ledgerNavigate.cancelLedgerAction();
          toast.error('No input signing config defined');
          return;
        }

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
      },
    });

  function closeAction() {
    appEvents.publish('ledgerBitcoinTxSigningCancelled', {
      unsignedPsbt: unsignedTransaction ? bytesToHex(unsignedTransaction.toPSBT()) : '',
    });
    ledgerNavigate.cancelLedgerAction();
  }

  const ledgerContextValue: LedgerTxSigningContext = {
    chain,
    transaction: unsignedTransaction,
    signTransaction,
    latestDeviceResponse,
    awaitingDeviceConnection,
  };
  const canCancelLedgerAction = useCancelLedgerAction(awaitingDeviceConnection);

  return (
    <TxSigningFlow
      context={ledgerContextValue}
      closeAction={canCancelLedgerAction ? closeAction : undefined}
    />
  );
}
