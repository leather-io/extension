import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { LedgerError } from '@zondax/ledger-stacks';
import { getAddressFromPublicKey, TransactionVersion } from '@stacks/transactions';
import get from 'lodash.get';

import { delay } from '@app/common/utils';
import { logger } from '@shared/logger';
import {
  getAppVersion,
  prepareLedgerDeviceConnection,
  useActionCancellableByUser,
  useLedgerResponseState,
} from '@app/features/ledger/ledger-utils';

import { useAccounts, useCurrentAccount } from '@app/store/accounts/account.hooks';
import { BaseDrawer } from '@app/components/drawer/base-drawer';
import { makeLedgerCompatibleUnsignedAuthResponsePayload } from '@app/common/unsafe-auth-response';
import { useKeyActions } from '@app/common/hooks/use-key-actions';

import { finalizeAuthResponse } from '@shared/actions/finalize-auth-response';
import { useOnboardingState } from '@app/common/hooks/auth/use-onboarding-state';
import { useScrollLock } from '@app/common/hooks/use-scroll-lock';

import { useLedgerNavigate } from '../../hooks/use-ledger-navigate';
import { LedgerJwtSigningContext, LedgerJwtSigningProvider } from './ledger-sign-jwt.context';
import {
  addSignatureToAuthResponseJwt,
  getSha256HashOfJwtAuthPayload,
  signLedgerJwtHash,
} from './jwt-signing.utils';
import { useDefaultRequestParams } from '@app/common/hooks/use-default-request-search-params';

export function LedgerSignJwtContainer() {
  const location = useLocation();
  const ledgerNavigate = useLedgerNavigate();
  useScrollLock(true);

  const activeAccount = useCurrentAccount();
  const accounts = useAccounts();

  const keyActions = useKeyActions();
  const canUserCancelAction = useActionCancellableByUser();
  const { decodedAuthRequest, authRequest } = useOnboardingState();

  const [accountIndex, setAccountIndex] = useState<null | number>(null);

  useEffect(() => {
    const index = parseInt(get(location.state, 'index'), 10);
    if (Number.isFinite(index)) setAccountIndex(index);
  }, [location.state]);

  const [latestDeviceResponse, setLatestDeviceResponse] = useLedgerResponseState();

  const [awaitingDeviceConnection, setAwaitingDeviceConnection] = useState(false);

  const [jwtPayloadHash, setJwtPayloadHash] = useState<null | string>(null);
  const { origin, tabId } = useDefaultRequestParams();

  const signJwtPayload = async () => {
    if (!origin) throw new Error('Cannot sign payload for unknown origin');

    if (accountIndex === null) {
      logger.warn('No account index found');
      return;
    }

    if (!activeAccount || !decodedAuthRequest || !authRequest || !accounts) {
      logger.warn('No necessary state not found while performing JWT signing', {
        account: activeAccount,
        decodedAuthRequest,
        authRequest,
        accounts,
      });
      return;
    }

    const account = accounts[accountIndex];

    if (!account) {
      logger.warn('No account for given index found');
      return;
    }

    const stacks = await prepareLedgerDeviceConnection({
      setLoadingState: setAwaitingDeviceConnection,
      onError() {
        ledgerNavigate.toErrorStep();
      },
    });

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
      ledgerNavigate.toConnectionSuccessStep();
      await delay(1000);

      const authResponsePayload = await makeLedgerCompatibleUnsignedAuthResponsePayload({
        dataPublicKey: account.dataPublicKey,
        profile: {
          stxAddress: {
            testnet: getAddressFromPublicKey(account.stxPublicKey, TransactionVersion.Testnet),
            mainnet: getAddressFromPublicKey(account.stxPublicKey, TransactionVersion.Mainnet),
          },
        },
      });

      setJwtPayloadHash(getSha256HashOfJwtAuthPayload(authResponsePayload));

      ledgerNavigate.toAwaitingDeviceOperation({ hasApprovedOperation: false });

      const resp = await signLedgerJwtHash(stacks)(authResponsePayload, accountIndex);

      if (resp.returnCode === LedgerError.TransactionRejected) {
        ledgerNavigate.toOperationRejectedStep();
        return;
      }

      ledgerNavigate.toAwaitingDeviceOperation({ hasApprovedOperation: true });
      const authResponse = addSignatureToAuthResponseJwt(authResponsePayload, resp.signatureDER);
      await delay(600);
      keyActions.switchAccount(accountIndex);
      finalizeAuthResponse({
        decodedAuthRequest,
        authRequest,
        authResponse,
        requestingOrigin: origin,
        tabId,
      });

      await stacks.transport.close();
    } catch (e) {
      ledgerNavigate.toDeviceDisconnectStep();
    }
  };

  const onCancelConnectLedger = ledgerNavigate.cancelLedgerAction;

  const ledgerContextValue: LedgerJwtSigningContext = {
    signJwtPayload,
    jwtPayloadHash,
    latestDeviceResponse,
    awaitingDeviceConnection,
  };

  return (
    <LedgerJwtSigningProvider value={ledgerContextValue}>
      <BaseDrawer
        isShowing
        isWaitingOnPerformedAction={awaitingDeviceConnection || canUserCancelAction}
        onClose={onCancelConnectLedger}
        pauseOnClickOutside
        waitingOnPerformedActionMessage="Ledger device in use"
      >
        <Outlet />
      </BaseDrawer>
    </LedgerJwtSigningProvider>
  );
}
