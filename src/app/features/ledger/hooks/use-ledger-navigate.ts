import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { bytesToHex } from '@stacks/common';
import { StacksTransaction } from '@stacks/transactions';

import { SupportedBlockchains } from '@shared/constants';
import { BitcoinInputSigningConfig } from '@shared/crypto/bitcoin/signer-config';
import { RouteUrls } from '@shared/route-urls';
import {
  type UnsignedMessage,
  toSerializableUnsignedMessage,
} from '@shared/signature/signature-types';

import { immediatelyAttemptLedgerConnection } from './use-when-reattempt-ledger-connection';

export function useLedgerNavigate() {
  const navigate = useNavigate();
  const location = useLocation();

  return useMemo(
    () => ({
      toConnectStepAndTryAgain() {
        return navigate(`../${RouteUrls.ConnectLedger}`, {
          replace: true,
          state: { [immediatelyAttemptLedgerConnection]: true },
        });
      },

      toConnectAndSignStacksTransactionStep(transaction: StacksTransaction) {
        return navigate(RouteUrls.ConnectLedger, {
          replace: true,
          relative: 'path',
          state: { tx: bytesToHex(transaction.serialize()) },
        });
      },

      toConnectAndSignBitcoinTransactionStep(
        psbt: Uint8Array,
        inputsToSign?: BitcoinInputSigningConfig[]
      ) {
        return navigate(RouteUrls.ConnectLedger, {
          replace: true,
          relative: 'route',
          state: { tx: bytesToHex(psbt), inputsToSign },
        });
      },

      toConnectAndSignMessageStep(message: UnsignedMessage) {
        return navigate(RouteUrls.ConnectLedger, {
          replace: true,
          // Unsigned messages may contain unserializable data, such as bigint
          state: { ...toSerializableUnsignedMessage(message) },
        });
      },

      toDeviceBusyStep(description?: string) {
        return navigate(RouteUrls.DeviceBusy, { replace: true, state: { description } });
      },

      toConnectionSuccessStep(chain: SupportedBlockchains) {
        return navigate(RouteUrls.ConnectLedgerSuccess, { replace: true, state: { chain } });
      },

      toErrorStep(chain: SupportedBlockchains, errorMessage?: string) {
        return navigate(RouteUrls.ConnectLedgerError, {
          replace: true,
          state: { latestLedgerError: errorMessage, chain },
        });
      },

      toAwaitingDeviceOperation({ hasApprovedOperation }: { hasApprovedOperation: boolean }) {
        return navigate(RouteUrls.AwaitingDeviceUserAction, {
          replace: true,
          state: { hasApprovedOperation },
        });
      },

      toPublicKeyMismatchStep() {
        return navigate(RouteUrls.LedgerPublicKeyMismatch, { replace: true });
      },

      toDevicePayloadInvalid() {
        return navigate(RouteUrls.LedgerDevicePayloadInvalid, { replace: true });
      },

      toOperationRejectedStep(description?: string) {
        return navigate(RouteUrls.LedgerOperationRejected, {
          replace: true,
          state: { description },
        });
      },

      toDeviceDisconnectStep() {
        return navigate(RouteUrls.LedgerDisconnected, { replace: true });
      },

      toBroadcastErrorStep(error: string) {
        return navigate(RouteUrls.LedgerBroadcastError, { replace: true, state: { error } });
      },

      cancelLedgerAction() {
        // >> X in the dialog calls this same action but it doesn't know where the previous page is
        // can propose removing this X in the ledger dialog as it doesn't do anything anyway???
        // most of the time it's greyed out until you reject
        // TODO - test what happens for Approve

        console.log('pete', location.state);
        return navigate('..', { relative: 'path', replace: true, state: { ...location.state } });
      },

      cancelLedgerActionAndReturnHome() {
        return navigate(RouteUrls.Home);
      },
    }),

    [location.state, navigate]
  );
}
