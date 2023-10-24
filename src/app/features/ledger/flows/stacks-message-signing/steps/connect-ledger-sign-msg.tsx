import { useContext } from 'react';

import { CommonLedgerDeviceInlineWarnings } from '@app/features/ledger/components/ledger-inline-warnings';
import { ConnectLedger } from '@app/features/ledger/generic-steps/connect-device/connect-ledger';
import { useWhenReattemptingLedgerConnection } from '@app/features/ledger/hooks/use-when-reattempt-ledger-connection';

import { ledgerMsgSigningContext } from '../ledger-stacks-sign-msg.context';

export function ConnectLedgerSignMsg() {
  const { signMessage, latestDeviceResponse, awaitingDeviceConnection } =
    useContext(ledgerMsgSigningContext);

  useWhenReattemptingLedgerConnection(() => signMessage());

  return (
    <ConnectLedger
      chain="stacks"
      awaitingLedgerConnection={awaitingDeviceConnection}
      warning={
        <CommonLedgerDeviceInlineWarnings
          chain="stacks"
          latestDeviceResponse={latestDeviceResponse}
        />
      }
      onConnectLedger={signMessage}
      showInstructions={false}
    />
  );
}
