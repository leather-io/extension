import { CommonLedgerDeviceInlineWarnings } from '@app/features/ledger/components/ledger-inline-warnings';
import { useLedgerRequestKeysContext } from '@app/features/ledger/generic-flows/request-keys/ledger-request-keys.context';
import { ConnectLedgerLayout } from '@app/features/ledger/generic-steps/connect-device/connect-ledger.layout';
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
    <ConnectLedgerLayout
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
