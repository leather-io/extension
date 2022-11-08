import { useLatestLedgerError } from '@app/features/ledger/hooks/use-ledger-latest-route-error.hook';

import { ConnectLedgerErrorLayout } from '../../generic-steps';
import { useLedgerNavigate } from '../../hooks/use-ledger-navigate';

export function ConnectLedgerError() {
  const latestLedgerError = useLatestLedgerError();
  const ledgerNavigate = useLedgerNavigate();

  return (
    <ConnectLedgerErrorLayout
      warningText={latestLedgerError}
      onCancelConnectLedger={() => ledgerNavigate.cancelLedgerAction()}
      onTryAgain={() => ledgerNavigate.toConnectStepAndTryAgain()}
    />
  );
}
