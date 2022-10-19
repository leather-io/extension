import { useContext } from 'react';

import { ConnectLedgerLayout } from '@app/features/ledger/generic-steps';

import { CommonLedgerDeviceInlineWarnings } from '@app/features/ledger/components/ledger-inline-warnings';
import { ledgerJwtSigningContext } from '@app/features/ledger/flows/jwt-signing/ledger-sign-jwt.context';

export function ConnectLedgerSignJwt() {
  const { signJwtPayload, latestDeviceResponse, awaitingDeviceConnection } =
    useContext(ledgerJwtSigningContext);

  return (
    <ConnectLedgerLayout
      awaitingLedgerConnection={awaitingDeviceConnection}
      warning={<CommonLedgerDeviceInlineWarnings latestDeviceResponse={latestDeviceResponse} />}
      onConnectLedger={signJwtPayload}
      showInstructions={false}
    />
  );
}
