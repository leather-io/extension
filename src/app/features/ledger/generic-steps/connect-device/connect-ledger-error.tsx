import type { SupportedBlockchains } from '@leather.io/models';

import { useLocationState } from '@app/common/hooks/use-location-state';
import { capitalize } from '@app/common/utils';
import { useLatestLedgerError } from '@app/features/ledger/hooks/use-ledger-latest-route-error.hook';

import { ConnectLedgerErrorLayout } from '../../generic-steps';
import { useLedgerNavigate } from '../../hooks/use-ledger-navigate';

export function ConnectLedgerError() {
  const latestLedgerError = useLatestLedgerError();
  const ledgerNavigate = useLedgerNavigate();
  const chain = useLocationState<SupportedBlockchains>('chain');
  // TODO: here it would be better to use the actual app name from
  // LEDGER_APPS_MAP at src/app/features/ledger/utils/generic-ledger-utils.ts

  const appName = capitalize(chain);
  return (
    <ConnectLedgerErrorLayout
      warningText={latestLedgerError}
      appName={appName}
      onTryAgain={() => ledgerNavigate.toConnectStepAndTryAgain()}
    />
  );
}
