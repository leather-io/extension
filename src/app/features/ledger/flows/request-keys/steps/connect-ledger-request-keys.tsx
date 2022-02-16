import { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import get from 'lodash.get';

import { ConnectLedgerLayout } from '@app/features/ledger/steps/connect-ledger.layout';
import { useWhenReattemptingLedgerConnection } from '@app/features/ledger/hooks/use-when-reattempt-ledger-connection';
import { ledgerRequestKeysContext } from '@app/features/ledger/ledger-request-keys.context';
import { LedgerInlineWarnings } from '@app/features/ledger/components/ledger-inline-warnings';

export const ConnectLedgerRequestKeys = () => {
  const location = useLocation();

  const { pullPublicKeysFromDevice, latestDeviceResponse, awaitingDeviceConnection } =
    useContext(ledgerRequestKeysContext);

  const isLookingForLedger = get(location, 'state.isLookingForLedger');

  useWhenReattemptingLedgerConnection(() => pullPublicKeysFromDevice());

  return (
    <ConnectLedgerLayout
      awaitingLedgerConnection={awaitingDeviceConnection}
      isLookingForLedger={isLookingForLedger}
      warning={<LedgerInlineWarnings latestDeviceResponse={latestDeviceResponse} />}
      showInstructions
      onConnectLedger={pullPublicKeysFromDevice}
    />
  );
};
