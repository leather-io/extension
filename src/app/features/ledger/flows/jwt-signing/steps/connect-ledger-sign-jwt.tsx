import { useContext } from 'react';

import { CommonLedgerDeviceInlineWarnings } from '@app/features/ledger/components/ledger-inline-warnings';
import { ledgerJwtSigningContext } from '@app/features/ledger/flows/jwt-signing/ledger-sign-jwt.context';
import { ConnectLedger } from '@app/features/ledger/generic-steps';

export function ConnectLedgerSignJwt() {
  const { signJwtPayload, latestDeviceResponse, awaitingDeviceConnection } =
    useContext(ledgerJwtSigningContext);

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
      onConnectLedger={signJwtPayload}
      showInstructions={false}
    />
  );
}
