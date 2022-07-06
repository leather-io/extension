import { useLedgerNavigate } from '@app/features/ledger/hooks/use-ledger-navigate';
import { LedgerDeviceInvalidTxLayout } from '@app/features/ledger/steps/device-invalid-tx.layout';

export function LedgerDeviceInvalidTx() {
  const ledgerNavigate = useLedgerNavigate();
  return <LedgerDeviceInvalidTxLayout onClose={() => ledgerNavigate.cancelLedgerAction()} />;
}
