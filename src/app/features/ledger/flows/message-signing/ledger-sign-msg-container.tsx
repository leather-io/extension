import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { LedgerError } from '@zondax/ledger-stacks';
import get from 'lodash.get';

import { delay } from '@app/common/utils';
import {
  getAppVersion,
  prepareLedgerDeviceConnection,
  signLedgerUtf8Message,
  useActionCancellableByUser,
  useLedgerResponseState,
} from '@app/features/ledger/ledger-utils';

import { useCurrentAccount } from '@app/store/accounts/account.hooks';
import { BaseDrawer } from '@app/components/drawer/base-drawer';
import { useScrollLock } from '@app/common/hooks/use-scroll-lock';
import { logger } from '@shared/logger';

import { useLedgerNavigate } from '../../hooks/use-ledger-navigate';
import { useLedgerAnalytics } from '../../hooks/use-ledger-analytics.hook';
import { LedgerMessageSigningContext, LedgerMsgSigningProvider } from './ledger-sign-msg.context';

import { useLocationStateWithCache } from '@app/common/hooks/use-location-state';
import { useSignatureRequestSearchParams } from '@app/store/signatures/requests.hooks';
import { signatureVrsToRsv } from '@stacks/common';
import { finalizeMessageSignature } from '@shared/actions/finalize-message-signature';

export function LedgerSignMsgContainer() {
  useScrollLock(true);

  const location = useLocation();

  const ledgerNavigate = useLedgerNavigate();
  const ledgerAnalytics = useLedgerAnalytics();
  const message = useLocationStateWithCache('message');
  const account = useCurrentAccount();
  const { tabId, requestToken } = useSignatureRequestSearchParams();

  const [latestDeviceResponse, setLatestDeviceResponse] = useLedgerResponseState();
  const canUserCancelAction = useActionCancellableByUser();

  const [awaitingDeviceConnection, setAwaitingDeviceConnection] = useState(false);

  const signMessage = async () => {
    if (!account) return;
    const stacksApp = await prepareLedgerDeviceConnection({
      setLoadingState: setAwaitingDeviceConnection,
      onError() {
        ledgerNavigate.toErrorStep();
      },
    });

    const versionInfo = await getAppVersion(stacksApp);
    ledgerAnalytics.trackDeviceVersionInfo(versionInfo);
    setLatestDeviceResponse(versionInfo);
    if (versionInfo.deviceLocked) {
      setAwaitingDeviceConnection(false);
      return;
    }

    if (!tabId || !requestToken) {
      logger.warn('Cannot sign message without corresponding `tabId` or `requestToken');
      return;
    }

    ledgerNavigate.toDeviceBusyStep(`Sending message to Ledger`);
    await delay(1000);

    try {
      ledgerNavigate.toConnectionSuccessStep();
      await delay(1000);
      if (!message) throw new Error('No message to sign');
      ledgerNavigate.toAwaitingDeviceOperation({ hasApprovedOperation: false });
      const resp = await signLedgerUtf8Message(stacksApp)(message, account.index);
      // Assuming here that public keys are wrong. Alternatively, we may want
      // to proactively check the key before signing
      if (resp.returnCode === LedgerError.DataIsInvalid) {
        ledgerNavigate.toDevicePayloadInvalid();
        return;
      }

      if (resp.returnCode === LedgerError.TransactionRejected) {
        ledgerNavigate.toOperationRejectedStep(`Message signing operation rejected`);
        ledgerAnalytics.utf8MessageSignedOnLedgerRejected();
        finalizeMessageSignature({ requestPayload: requestToken, tabId, data: 'cancel' });
        return;
      }
      if (resp.returnCode !== LedgerError.NoErrors) {
        throw new Error('Some other error');
      }
      ledgerNavigate.toAwaitingDeviceOperation({ hasApprovedOperation: true });
      await delay(1000);

      ledgerAnalytics.utf8MessageSignedOnLedgerSuccessfully();

      finalizeMessageSignature({
        requestPayload: requestToken,
        tabId,
        data: {
          signature: signatureVrsToRsv(resp.signatureVRS.toString('hex')),
          publicKey: account.stxPublicKey,
        },
      });

      await stacksApp.transport.close();
    } catch (e) {
      ledgerNavigate.toDeviceDisconnectStep();
    }
  };

  const allowUserToGoBack = get(location.state, 'goBack');

  const onCancelConnectLedger = allowUserToGoBack
    ? ledgerNavigate.cancelLedgerActionAndReturnHome
    : ledgerNavigate.cancelLedgerAction;

  const ledgerContextValue: LedgerMessageSigningContext = {
    message,
    signMessage,
    latestDeviceResponse,
    awaitingDeviceConnection,
  };

  return (
    <LedgerMsgSigningProvider value={ledgerContextValue}>
      <BaseDrawer
        enableGoBack={allowUserToGoBack}
        isShowing
        isWaitingOnPerformedAction={awaitingDeviceConnection || canUserCancelAction}
        onClose={onCancelConnectLedger}
        pauseOnClickOutside
        waitingOnPerformedActionMessage="Ledger device in use"
      >
        <Outlet />
      </BaseDrawer>
    </LedgerMsgSigningProvider>
  );
}
