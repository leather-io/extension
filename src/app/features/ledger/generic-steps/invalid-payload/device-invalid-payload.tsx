import { useLedgerNavigate } from '../../hooks/use-ledger-navigate';
import { LedgerDeviceInvalidPayloadLayout } from '../../generic-steps/invalid-payload/device-invalid-payload.layout';

export function LedgerDeviceInvalidPayload() {
  const ledgerNavigate = useLedgerNavigate();
  return <LedgerDeviceInvalidPayloadLayout onClose={() => ledgerNavigate.cancelLedgerAction()} />;
}
