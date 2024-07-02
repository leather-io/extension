import type { SupportedBlockchains } from '@leather.io/models';

import { useLocationState } from '@app/common/hooks/use-location-state';

import { ConnectLedgerSuccessLayout } from './connect-ledger-success.layout';

export function ConnectLedgerSuccess() {
  const chain = useLocationState<SupportedBlockchains>('chain');
  return <ConnectLedgerSuccessLayout chain={chain} />;
}
