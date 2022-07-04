import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { LedgerError } from '@zondax/ledger-blockstack';
import { logger } from '@shared/logger';
import get from 'lodash.get';

import { delay } from '@app/common/utils';
import {
  addSignatureToAuthResponseJwt,
  getAppVersion,
  getSha256HashOfJwtAuthPayload,
  prepareLedgerDeviceConnection,
  signLedgerJwtHash,
  useLedgerResponseState,
} from '@app/features/ledger/ledger-utils';
import { getAddressFromPublicKey, TransactionVersion } from '@stacks/transactions';

import { useCurrentAccount } from '@app/store/accounts/account.hooks';
import { BaseDrawer } from '@app/components/drawer/base-drawer';
import { makeLedgerCompatibleUnsignedAuthResponsePayload } from '@app/common/unsafe-auth-response';
import { useKeyActions } from '@app/common/hooks/use-key-actions';

import { useLedgerNavigate } from '../../hooks/use-ledger-navigate';
import { LedgerJwtSigningProvider } from '../../ledger-jwt-signing.context';
import { finalizeAuthResponse } from '@app/common/actions/finalize-auth-response';
import { useOnboardingState } from '@app/common/hooks/auth/use-onboarding-state';
import { useScrollLock } from '@app/common/hooks/use-scroll-lock';

export function LedgerSignJwtContainer() {
  const location = useLocation();
  const ledgerNavigate = useLedgerNavigate();
  useScrollLock(true);

  const account = useCurrentAccount();
  const keyActions = useKeyActions();
  const { decodedAuthRequest, authRequest } = useOnboardingState();

  const [accountIndex, setAccountIndex] = useState<null | number>(null);

  useEffect(() => {
    const index = parseInt(get(location.state, 'index'), 10);
    if (Number.isFinite(index)) setAccountIndex(index);
    return () => setAccountIndex(null);
  }, [location.state]);

  const [latestDeviceResponse, setLatestDeviceResponse] = useLedgerResponseState();

  const [awaitingDeviceConnection, setAwaitingDeviceConnection] = useState(false);
  const [awaitingSignedJwt, setAwaitingSignedJwt] = useState(false);
  const [jwtPayloadHash, setJwtPayloadHash] = useState<null | string>(null);

  const signJwtPayload = async () => {
    if (!account || !decodedAuthRequest || !authRequest || accountIndex === null) return;

    const stacks = await prepareLedgerDeviceConnection({
      setLoadingState: setAwaitingDeviceConnection,
      onError() {
        ledgerNavigate.toErrorStep();
      },
    });

    if (!stacks) return;
    const versionInfo = await getAppVersion(stacks);
    setLatestDeviceResponse(versionInfo);

    if (versionInfo.deviceLocked) {
      setAwaitingDeviceConnection(false);
      return;
    }

    if (versionInfo.returnCode !== LedgerError.NoErrors) {
      logger.error('Return code from device has error', versionInfo);
      return;
    }

    try {
      setAwaitingSignedJwt(true);
      ledgerNavigate.toConnectionSuccessStep();
      await delay(1000);

      const authResponsePayload = await makeLedgerCompatibleUnsignedAuthResponsePayload({
        dataPublicKey: account.dataPublicKey,
        profile: {
          stxAddress: {
            testnet: getAddressFromPublicKey(
              (account as any).stxPublicKey,
              TransactionVersion.Testnet
            ),
            mainnet: getAddressFromPublicKey(
              (account as any).stxPublicKey,
              TransactionVersion.Mainnet
            ),
          },
        },
      });

      setJwtPayloadHash(getSha256HashOfJwtAuthPayload(authResponsePayload));

      ledgerNavigate.toAwaitingDeviceOperation({ hasApprovedOperation: false });

      const resp = await signLedgerJwtHash(stacks)(authResponsePayload, accountIndex);

      if (resp.returnCode === LedgerError.TransactionRejected) {
        setAwaitingSignedJwt(false);
        ledgerNavigate.toTransactionRejectedStep();
        return;
      }

      ledgerNavigate.toAwaitingDeviceOperation({ hasApprovedOperation: true });
      const authResponse = addSignatureToAuthResponseJwt(authResponsePayload, resp.signatureDER);
      await delay(600);
      keyActions.switchAccount(accountIndex);
      finalizeAuthResponse({ decodedAuthRequest, authRequest, authResponse });
      setAwaitingSignedJwt(false);
    } catch (e) {
      setAwaitingSignedJwt(false);
      ledgerNavigate.toDeviceDisconnectStep();
    }
  };

  const onCancelConnectLedger = ledgerNavigate.cancelLedgerAction;

  const ledgerContextValue = {
    signJwtPayload,
    jwtPayloadHash,
    latestDeviceResponse,
    awaitingDeviceConnection,
    onCancelConnectLedger,
  };

  return (
    <LedgerJwtSigningProvider value={ledgerContextValue}>
      <BaseDrawer
        isShowing
        isWaitingOnPerformedAction={awaitingDeviceConnection || awaitingSignedJwt}
        onClose={onCancelConnectLedger}
        pauseOnClickOutside
        waitingOnPerformedActionMessage="Ledger device in use"
      >
        <Outlet />
      </BaseDrawer>
    </LedgerJwtSigningProvider>
  );
}
