import { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import get from 'lodash.get';

import { ConnectLedgerLayout } from '@app/features/ledger/steps/connect-ledger.layout';

import { CommonLedgerDeviceInlineWarnings } from '@app/features/ledger/components/ledger-inline-warnings';
import { ledgerJwtSigningContext } from '@app/features/ledger/ledger-jwt-signing.context';

export function ConnectLedgerSignJwt() {
  const location = useLocation();

  const { signJwtPayload, latestDeviceResponse, awaitingDeviceConnection } =
    useContext(ledgerJwtSigningContext);

  const isLookingForLedger = get(location, 'state.isLookingForLedger');

  return (
    <ConnectLedgerLayout
      awaitingLedgerConnection={awaitingDeviceConnection}
      isLookingForLedger={isLookingForLedger}
      warning={<CommonLedgerDeviceInlineWarnings latestDeviceResponse={latestDeviceResponse} />}
      onConnectLedger={signJwtPayload}
      showInstructions={false}
    />
  );
}
