import { useContext } from 'react';

import { ConnectLedgerLayout } from '@app/features/ledger/generic-steps/connect-device/connect-ledger.layout';
import { useWhenReattemptingLedgerConnection } from '@app/features/ledger/hooks/use-when-reattempt-ledger-connection';
import { ledgerRequestKeysContext } from '@app/features/ledger/flows/request-keys/ledger-request-keys.context';
import { CommonLedgerDeviceInlineWarnings } from '@app/features/ledger/components/ledger-inline-warnings';

export const ConnectLedgerRequestKeys = () => {
  const {
    pullPublicKeysFromDevice,
    latestDeviceResponse,
    awaitingDeviceConnection,
    outdatedAppVersionWarning,
  } = useContext(ledgerRequestKeysContext);

  useWhenReattemptingLedgerConnection(() => pullPublicKeysFromDevice());

  return (
    <ConnectLedgerLayout
      awaitingLedgerConnection={awaitingDeviceConnection}
      warning={
        <CommonLedgerDeviceInlineWarnings
          latestDeviceResponse={latestDeviceResponse}
          outdatedLedgerAppWarning={outdatedAppVersionWarning}
        />
      }
      showInstructions
      onConnectLedger={pullPublicKeysFromDevice}
    />
  );
};
