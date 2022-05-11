import { ConnectLedgerErrorLayout } from '@app/features/ledger/steps/connect-ledger-error.layout';
import { useLatestLedgerError } from '@app/features/ledger/hooks/use-ledger-latest-route-error.hook';
import { useLedgerNavigate } from '../../../hooks/use-ledger-navigate';

export function ConnectLedgerSignJwtError() {
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
