import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { bytesToHex, signatureVrsToRsv } from '@stacks/common';
import { serializeCV } from '@stacks/transactions';
import { LedgerError } from '@zondax/ledger-stacks';
import get from 'lodash.get';

import { finalizeMessageSignature } from '@shared/actions/finalize-message-signature';
import { logger } from '@shared/logger';
import { UnsignedMessage, whenSignableMessageOfType } from '@shared/signature/signature-types';

import { useScrollLock } from '@app/common/hooks/use-scroll-lock';
import { delay } from '@app/common/utils';
import { BaseDrawer } from '@app/components/drawer/base-drawer';
import {
  getStacksAppVersion,
  prepareLedgerDeviceStacksAppConnection,
  signLedgerStacksStructuredMessage,
  signLedgerStacksUtf8Message,
  useActionCancellableByUser,
} from '@app/features/ledger/utils/stacks-ledger-utils';
import { useCurrentStacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { StacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.models';
import { useSignatureRequestSearchParams } from '@app/store/signatures/requests.hooks';

import { useLedgerAnalytics } from '../../hooks/use-ledger-analytics.hook';
import { useLedgerNavigate } from '../../hooks/use-ledger-navigate';
import { useVerifyMatchingLedgerStacksPublicKey } from '../../hooks/use-verify-matching-stacks-public-key';
import { checkLockedDeviceError, useLedgerResponseState } from '../../utils/generic-ledger-utils';
import {
  LedgerMessageSigningContext,
  LedgerMsgSigningProvider,
} from './ledger-stacks-sign-msg.context';
import { useUnsignedMessageType } from './use-message-type';

interface LedgerSignMsgData {
  account: StacksAccount;
  unsignedMessage: UnsignedMessage;
}
interface LedgerSignMsgDataProps {
  children({ account, unsignedMessage }: LedgerSignMsgData): React.JSX.Element;
}
function LedgerSignMsgData({ children }: LedgerSignMsgDataProps) {
  const account = useCurrentStacksAccount();
  const unsignedMessage = useUnsignedMessageType();
  if (!unsignedMessage || !account) return null;
  return children({ account, unsignedMessage });
}

type LedgerSignMsgProps = LedgerSignMsgData;
function LedgerSignStacksMsg({ account, unsignedMessage }: LedgerSignMsgProps) {
  useScrollLock(true);

  const location = useLocation();
  const ledgerNavigate = useLedgerNavigate();
  const ledgerAnalytics = useLedgerAnalytics();
  const verifyLedgerPublicKey = useVerifyMatchingLedgerStacksPublicKey();
  const { tabId, requestToken } = useSignatureRequestSearchParams();

  const [latestDeviceResponse, setLatestDeviceResponse] = useLedgerResponseState();
  const canUserCancelAction = useActionCancellableByUser();

  const [awaitingDeviceConnection, setAwaitingDeviceConnection] = useState(false);

  async function signMessage() {
    const stacksApp = await prepareLedgerDeviceStacksAppConnection({
      setLoadingState: setAwaitingDeviceConnection,
      onError(e) {
        if (e instanceof Error && checkLockedDeviceError(e)) {
          setLatestDeviceResponse({ deviceLocked: true } as any);
          return;
        }
        ledgerNavigate.toErrorStep();
      },
    });

    const versionInfo = await getStacksAppVersion(stacksApp);
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

    ledgerNavigate.toDeviceBusyStep(`Verifying public key on Ledger…`);
    await verifyLedgerPublicKey(stacksApp);

    try {
      ledgerNavigate.toConnectionSuccessStep('stacks');
      await delay(1000);
      ledgerNavigate.toAwaitingDeviceOperation({ hasApprovedOperation: false });

      const resp = await whenSignableMessageOfType(unsignedMessage)({
        async utf8(msg) {
          return signLedgerStacksUtf8Message(stacksApp)(msg, account.index);
        },
        async structured(domain, msg) {
          return signLedgerStacksStructuredMessage(stacksApp)(
            bytesToHex(serializeCV(domain)),
            bytesToHex(serializeCV(msg)),
            account.index
          );
        },
      });

      // Assuming here that public keys are wrong. Alternatively, we may want
      // to proactively check the key before signing
      if (resp.returnCode === LedgerError.DataIsInvalid) {
        ledgerNavigate.toDevicePayloadInvalid();
        return;
      }

      if (resp.returnCode === LedgerError.TransactionRejected) {
        ledgerNavigate.toOperationRejectedStep(`Message signing operation rejected`);
        ledgerAnalytics.messageSignedOnLedgerRejected();
        finalizeMessageSignature({ requestPayload: requestToken, tabId, data: 'cancel' });
        return;
      }
      if (resp.returnCode !== LedgerError.NoErrors) {
        throw new Error('Some other error');
      }
      ledgerNavigate.toAwaitingDeviceOperation({ hasApprovedOperation: true });
      await delay(1000);

      ledgerAnalytics.messageSignedOnLedgerSuccessfully();

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
  }

  const allowUserToGoBack = get(location.state, 'goBack');

  const ledgerContextValue: LedgerMessageSigningContext = {
    message: unsignedMessage,
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
        onClose={ledgerNavigate.cancelLedgerAction}
        pauseOnClickOutside
        waitingOnPerformedActionMessage="Ledger device in use"
      >
        <Outlet />
      </BaseDrawer>
    </LedgerMsgSigningProvider>
  );
}

export function LedgerSignMsgContainer() {
  return <LedgerSignMsgData>{props => <LedgerSignStacksMsg {...props} />}</LedgerSignMsgData>;
}
