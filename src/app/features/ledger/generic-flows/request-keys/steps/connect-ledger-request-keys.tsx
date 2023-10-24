import { CommonLedgerDeviceInlineWarnings } from '@app/features/ledger/components/ledger-inline-warnings';
import { useLedgerRequestKeysContext } from '@app/features/ledger/generic-flows/request-keys/ledger-request-keys.context';
import { ConnectLedger } from '@app/features/ledger/generic-steps/connect-device/connect-ledger';
import { useWhenReattemptingLedgerConnection } from '@app/features/ledger/hooks/use-when-reattempt-ledger-connection';

export function ConnectLedgerRequestKeys() {
  const {
    pullPublicKeysFromDevice,
    latestDeviceResponse,
    awaitingDeviceConnection,
    outdatedAppVersionWarning,
    chain,
  } = useLedgerRequestKeysContext();

  useWhenReattemptingLedgerConnection(() => pullPublicKeysFromDevice());

  return (
    <ConnectLedger
      chain={chain}
      awaitingLedgerConnection={awaitingDeviceConnection}
      warning={
        <CommonLedgerDeviceInlineWarnings
          chain={chain}
          latestDeviceResponse={latestDeviceResponse}
          outdatedLedgerAppWarning={outdatedAppVersionWarning}
        />
      }
      showInstructions
      onConnectLedger={pullPublicKeysFromDevice}
    />
  );
}
